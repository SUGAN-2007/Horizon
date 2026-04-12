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

    const fillers = Math.max(0, num - products.length);
    return (
        <>
            <div className="cart">
                {products.slice(0, num).map(item => (
                    <div className="cart-card" key={item.id}>
                        <div className='cart-image'>
                            <img onClick={() => navigate(`/clothes/${item.id}`)} className='pop-img' src={item.image} alt={item.title} onError={(e) => {
                                e.target.style.display = "none";
                                e.target.parentNode.classList.add("skeleton-box");
                            }} />
                        </div>
                        <div className='cart-info'>
                            <p onClick={() => navigate(`/clothes/${item.id}`)} className='product-name'>{item.title}</p>
                            <div className='cart-btn'>
                                <p className='product-price'>₹{item.price}</p>
                                <button
                                    className={`add-btn ${!user ? 'guest-btn' : ''}`}
                                    onClick={() => {
                                        if (!user) {
                                            setShowLogin(true);
                                            return;
                                        }
                                        addToCart(item, "M"); // Default size M for now from quick add
                                        setToast(true);
                                        setTimeout(() => setToast(false), 1000);
                                    }}
                                >
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div >
            {toast && <Toast message={"Added to cart Successfully"} />}
        </>
    )
}
export default ProductGrid;