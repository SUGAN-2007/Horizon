import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from './UserContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { session, user } = useUser();
    const [cart, setCart] = useState([]);

    const fetchCart = async () => {
        if (!session) return;
        try {
            const res = await fetch("http://localhost:5000/api/cart/", {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                const formattedData = data.map(item => ({
                    ...item.products,
                    cart_item_id: item.id,
                    quantity: item.quantity,
                    size: item.size
                }));
                setCart(formattedData);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart([]);
        }
    }, [user, session]);

    const addToCart = async (product, size, quantity = 1) => {
        if (!user) {
            setCart(prev => [...prev, { ...product, size, quantity }]);
            return;
        }
        try {
            const res = await fetch("http://localhost:5000/api/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ productId: product.id, size, quantity }),
            });
            if (res.ok) fetchCart();
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const removeFromCart = async (cartItemId) => {
        if (!user) {
            setCart(prev => prev.filter((_, i) => i !== cartItemId)); // Fallback for guest
            return;
        }
        try {
            const res = await fetch(`http://localhost:5000/api/cart/remove/${cartItemId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });
            if (res.ok) fetchCart();
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    const updateQuantity = async (cartItemId, quantity) => {
        if (quantity < 1) return removeFromCart(cartItemId);
        if (!user) {
            setCart(prev => prev.map((item, i) => i === cartItemId ? { ...item, quantity } : item));
            return;
        }
        try {
            const res = await fetch(`http://localhost:5000/api/cart/update/${cartItemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ quantity }),
            });
            if (res.ok) fetchCart();
        } catch (error) {
            console.error("Error updating cart quantity:", error);
        }
    };


    const placeOrder = async (orderData) => {
        if (!user || cart.length === 0) return;
        try {
            const res = await fetch("http://localhost:5000/api/orders/place", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(orderData)
            });
            if (res.ok) {
                const data = await res.json();
                setCart([]);
                return data;
            }
        } catch (error) {
            console.error("Error placing order:", error);
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    };

    return (
        <CartContext.Provider value={{ cart, setCart, fetchCart, addToCart, removeFromCart, updateQuantity, placeOrder, calculateTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
