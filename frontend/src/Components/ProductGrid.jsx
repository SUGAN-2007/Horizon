import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import '../css/ProductGrid.css';
import Toast from './toast';

function ProductGrid({ num, products }) {
    const navigate = useNavigate();
    const [toast, setToast] = useState(false);
    const { addToCart } = useCart();
    const { user, setShowLogin } = useUser();

    return (
        <>
            <div className="cart">
                {products.slice(0, num).map(item => {
                    const now = new Date();
                    const expiry = item.discount_until ? new Date(item.discount_until) : null;
                    const isExpired = expiry && now > expiry;
                    const isDiscounted = item.discount_percent > 0 && !isExpired;

                    const getTimeLeft = () => {
                        if (!expiry || isExpired) return null;
                        const diff = expiry - now;
                        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                        if (days === 1) return "Ends tomorrow";
                        if (days === 0) return "Ends today";
                        if (days <= 7) return `Ends in ${days} days`;
                        return ""; // Too far out to show timer
                    };

                    const timeLeft = getTimeLeft();

                    return (
                        <div className="cart-card" key={item.id}>
                            <div className='cart-image'>
                                {item.rating_rate >= 4.5 && <span className="best-seller-badge">Best Seller</span>}
                                {isDiscounted && (
                                    <div className="discount-badge">
                                        {item.discount_percent}% OFF
                                        {timeLeft && <span className="discount-timer-small" style={{ display: 'block', fontSize: '10px', opacity: 0.9 }}>{timeLeft}</span>}
                                    </div>
                                )}
                                <img
                                    onClick={() => navigate(`/clothes/${item.id}`)}
                                    className='pop-img'
                                    src={item.image}
                                    alt={item.title}
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.parentNode.classList.add("skeleton-box");
                                    }}
                                />
                            </div>
                            <div className='cart-info'>
                                <p onClick={() => navigate(`/clothes/${item.id}`)} className='product-name'>{item.title}</p>
                                <div className='cart-btn'>
                                    <div className='price-container'>
                                        {isDiscounted ? (
                                            <>
                                                <span className='original-price'>₹{item.price}</span>
                                                <span className='product-price'>₹{Math.floor(item.price * (1 - item.discount_percent / 100))}</span>
                                            </>
                                        ) : (
                                            <p className='product-price'>₹{item.price}</p>
                                        )}
                                    </div>
                                    <button
                                        className={`add-btn ${!user ? 'guest-btn' : ''}`}
                                        onClick={() => {
                                            if (!user) {
                                                setShowLogin(true);
                                                return;
                                            }
                                            addToCart(item, "M");
                                            setToast(true);
                                            setTimeout(() => setToast(false), 1000);
                                        }}
                                    >
                                        Add to cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {toast && <Toast message={"Added to cart Successfully"} />}
        </>
    );
}

export default ProductGrid;