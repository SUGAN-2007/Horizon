// import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../css/Cart.css';
function Cart({ num, products, cart, setCart }) {
    // const navigate = useNavigate();
    const [toast, setToast] = useState(false);

    const fillers = Math.max(0, num - products.length);
    return (
        <>
            <div className="cart">
                {products.slice(0, num).map(item => (
                    <div className="cart-card" key={item.id}>
                        <div className='cart-image'>
                            <img className='pop-img' src={item.image} alt={item.title} onError={(e) => {
                                e.target.style.display = "none";
                                e.target.parentNode.classList.add("skeleton-box");
                            }} />
                        </div>
                        <div className='cart-info'>
                            <p className='product-name'>{item.title}</p>
                            {/* onClick={() => navigate(`/product/${item.id}`)} */}
                            <div className='cart-btn'>
                                <p className='product-price'>${item.price}</p>
                                <button
                                    className="add-btn"
                                    onClick={() => {
                                        ssetCart(prev => [...prev, item]);
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
                {Array.from({ length: fillers }).map((_, i) => (
                    <div className="cart-card" key={`placeholder-${i}`}>
                        <div className="popular-image skeleton-box"></div>

                        <div className="cart-info">
                            <p className="product-name">Coming Soon</p>
                            <p className="product-price uploading">Uploading…</p>
                        </div>
                    </div>
                ))}
            </div >
            {toast &&
                <div className="toast-bottom">
                    <div className="toast-icon">✔</div>
                    <div className="toast-text">Added to cart Successfully </div>
                </div>
            }
        </>
    )
}
export default Cart;