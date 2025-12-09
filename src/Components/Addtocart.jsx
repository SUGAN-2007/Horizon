import { Link } from 'react-router-dom';
import '../css/addtocart.css';

function Addtocart({ setOpencart, cart, setCart }) {
    const safeCart = Array.isArray(cart) ? cart : [];
    return (
        <>
            <div className="cart-in">
                <div className="addcart">
                    <button className="add-close" onClick={() => setOpencart(false)}>
                        <img src="/close.png" />
                    </button>
                    <p className='add-cart'>Cart</p>
                    <div className={safeCart.length === 0 ? "empty" : "empty1"}>
                        {safeCart.length === 0 && (
                            <>
                                <p>Your cart is empty</p>
                                <Link to="/Shop"><button onClick={() => { setOpencart(false) }}>Continue Shopping</button></Link>
                            </>
                        )}
                    </div>
                    {safeCart.length > 0 && (
                        <div className="cart-items">
                            {safeCart.map((item) => (
                                <div className="cart-card" id='cart-card' key={item.id}>
                                    <div className='cart-image'>
                                        <img className='pop-img' src={item.image} alt={item.title} />
                                    </div>
                                    <div className='cart-info'>
                                        <p className='product-name'>{item.title}</p>
                                        <div className='cart-btn'>
                                            <p className='product-price ' id='add-pri'>${item.price}</p>
                                            <button className='add-btn' id='add-btn'>Order</button>
                                        </div>
                                        <button
                                            className="del"
                                            onClick={() => {
                                                const newcart = cart.filter(c => c.id !== item.id);
                                                setCart(newcart);
                                            }}
                                        >
                                            Remove
                                        </button>

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div >
        </>
    );
}

export default Addtocart;
