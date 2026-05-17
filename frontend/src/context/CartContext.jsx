import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from './UserContext.jsx';
import { supabase } from '../lib/supabase';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useUser();
    const [cart, setCart] = useState([]);

    const fetchCart = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('cart')
            .select('id, quantity, size, products(*)')
            .eq('user_id', user.id);
        if (!error && Array.isArray(data)) {
            setCart(data.map(item => ({
                ...item.products,
                cart_item_id: item.id,
                quantity: item.quantity,
                size: item.size
            })));
        }
    };

    useEffect(() => {
        if (user) fetchCart();
        else setCart([]);
    }, [user]);

    const addToCart = async (product, size, quantity = 1) => {
        if (!user) {
            setCart(prev => {
                const existing = prev.find(item => item.id === product.id && item.size === size);
                if (existing) {
                    return prev.map(item => 
                        item.id === product.id && item.size === size 
                            ? { ...item, quantity: (item.quantity || 1) + quantity } 
                            : item
                    );
                }
                return [...prev, { ...product, size, quantity, cart_item_id: Date.now() + Math.random() }];
            });
            return;
        }
        const { data: existing } = await supabase
            .from('cart')
            .select('*')
            .eq('user_id', user.id)
            .eq('product_id', product.id)
            .eq('size', size)
            .maybeSingle();

        if (existing) {
            await supabase.from('cart').update({ quantity: (existing.quantity || 1) + quantity }).eq('id', existing.id);
        } else {
            await supabase.from('cart').insert([{ user_id: user.id, product_id: product.id, size, quantity }]);
        }
        fetchCart();
    };

    const removeFromCart = async (cartItemId) => {
        if (!user) {
            setCart(prev => prev.filter(item => item.cart_item_id !== cartItemId));
            return;
        }
        await supabase.from('cart').delete().eq('id', cartItemId);
        fetchCart();
    };

    const updateQuantity = async (cartItemId, quantity) => {
        if (quantity < 0) return; // Don't allow negative quantity
        if (!user) {
            setCart(prev => prev.map(item => item.cart_item_id === cartItemId ? { ...item, quantity } : item));
            return;
        }
        await supabase.from('cart').update({ quantity }).eq('id', cartItemId);
        fetchCart();
    };

    const placeOrder = async (orderData) => {
        if (!user || cart.length === 0) return;

        // Get current session token to authenticate with Edge Function
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        try {
            // Call Edge Function — handles DB insert + email notification
            const { data, error: invokeError } = await supabase.functions.invoke('api/orders/place', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                },
                body: {
                    address: orderData.address,
                    phone: orderData.phone,
                    paymentMethod: orderData.paymentMethod || 'COD',
                    cartItems: cart.filter(item => item.quantity > 0),
                }
            });

            if (invokeError) {
                console.error('Order placement failed:', invokeError);
                return false;
            }

            setCart([]);
            return true; // Return boolean for Checkout.jsx logic
        } catch (error) {
            console.error('Error placing order:', error);
            return false;
        }
    };

    const calculateTotal = () => cart
        .filter(item => item.quantity > 0)
        .reduce((total, item) => {
        const isDiscountActive = item.discount_percent > 0 &&
            (!item.discount_until || new Date(item.discount_until) > new Date());

        const price = isDiscountActive
            ? Math.floor(item.price * (1 - item.discount_percent / 100))
            : item.price;

        return total + (price * (item.quantity || 1));
    }, 0);

    return (
        <CartContext.Provider value={{ cart, setCart, fetchCart, addToCart, removeFromCart, updateQuantity, placeOrder, calculateTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
