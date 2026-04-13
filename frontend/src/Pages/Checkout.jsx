import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Nav from '../Components/Nav';
import '../css/Checkout.css';

function Checkout() {
    const { cart, calculateTotal, placeOrder } = useCart();
    const { profile, user } = useUser();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);

    // Form states for address (initialized with profile data if available)
    const [address, setAddress] = useState({
        fullName: profile?.full_name || '',
        phone: profile?.phone || '',
        street: profile?.address || '',
        city: '',
        state: '',
        pincode: ''
    });

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    // Update address when profile loads
    useEffect(() => {
        if (profile) {
            setAddress(prev => ({
                ...prev,
                fullName: profile.full_name || prev.fullName,
                phone: profile.phone || prev.phone,
                street: profile.address || prev.street
            }));
        }
    }, [profile]);

    const handleInputChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!address.fullName || !address.phone || !address.street) {
            alert("Please fill in all required address fields");
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                items: cart,
                total: calculateTotal(),
                address: `${address.street}${address.city ? ', ' + address.city : ''}${address.state ? ', ' + address.state : ''}${address.pincode ? ' - ' + address.pincode : ''}`,
                phone: address.phone,
                paymentMethod: paymentMethod
            };

            const success = await placeOrder(orderData);
            if (success) {
                alert("Order placed successfully!");
                navigate('/profile');
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <>
                <Nav />
                <div className="checkout-empty">
                    <h2>Your cart is empty</h2>
                    <button onClick={() => navigate('/Shop')}>Go to Shop</button>
                </div>
            </>
        );
    }

    return (
        <div className="checkout-page">
            <Nav />
            <div className="checkout-container">
                <h1 className="checkout-title">Checkout</h1>

                <div className="checkout-grid">
                    <div className="checkout-left">
                        {/* 1. Shipping Address */}
                        <section className="checkout-section">
                            <div className="section-header">
                                <span className="section-number">1</span>
                                <h2>Shipping Address</h2>
                            </div>
                            <div className="section-content">
                                <form className="address-form">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={address.fullName}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={address.phone}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 10) handleInputChange({ target: { name: 'phone', value: val } });
                                            }}
                                            placeholder="10 digit number"
                                            maxLength="10"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Street Address</label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={address.street}
                                            onChange={handleInputChange}
                                            placeholder="House No, Street, Locality"
                                            required
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={address.city}
                                                onChange={handleInputChange}
                                                placeholder="City"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Pincode</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={address.pincode}
                                                onChange={handleInputChange}
                                                placeholder="6 digit pincode"
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </section>

                        {/* 2. Review Items (Swapped here) */}
                        <section className="checkout-section">
                            <div className="section-header">
                                <span className="section-number">2</span>
                                <h2>Review Items</h2>
                            </div>
                            <div className="section-content">
                                <div className="checkout-items">
                                    {cart.map((item) => (
                                        <div key={item.cart_item_id} className="checkout-item-card">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                onClick={() => navigate(`/clothes/${item.id}`)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <div className="item-details">
                                                <p
                                                    className="item-name"
                                                    onClick={() => navigate(`/clothes/${item.id}`)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {item.title}
                                                </p>
                                                <p className="item-variant">Size: {item.size} | Qty: {item.quantity || 1}</p>
                                                <p className="item-price">
                                                    {item.quantity > 1 ? `₹${item.price} x ${item.quantity} = ` : ''}
                                                    ₹{item.price * (item.quantity || 1)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="checkout-right">
                        <div className="order-summary-card">
                            <h3>Order Summary</h3>
                            <div className="summary-items-list">
                                {cart.map((item) => (
                                    <div className="summary-row item-list-row" key={`${item.id}-${item.size}`}>
                                        <span className="summary-item-name">
                                            {item.title} {item.quantity > 1 ? `(x${item.quantity})` : ''}
                                        </span>
                                        <span className="summary-item-price">
                                            ₹{item.price * (item.quantity || 1)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-row">
                                <span>Delivery Fee:</span>
                                <span>FREE</span>
                            </div>
                            <div className="summary-row highlights">
                                <span>Payment:</span>
                                <span>Cash on Delivery</span>
                            </div>
                            <div className="summary-total">
                                <span>Order Total:</span>
                                <span>₹{calculateTotal()}</span>
                            </div>
                            <button
                                className="place-order-btn"
                                onClick={handlePlaceOrder}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>
                            <p className="order-policy">
                                By placing your order, you agree to Horizon's privacy notice and conditions of use.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
