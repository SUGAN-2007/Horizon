import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../css/CartSidebar.css';

function Addtocart({ setOpencart }) {
    const { cart, removeFromCart, updateQuantity, placeOrder } = useCart();
    const navigate = useNavigate();

    const handleCheckout = async () => {
        const order = await placeOrder();
        if (order) {
            alert("Order placed successfully!");
            setOpencart(false);
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    };

    return (
        <div className="cart-in">
            <div className="addcart">
                <div className='cart-header-top'>
                    <p className='add-cart'>Your Cart ({cart.length})</p>
                    <button className="add-close" onClick={() => setOpencart(false)}>
                        <img src="/close.png" alt="Close" />
                    </button>
                </div>

                <div className={cart.length === 0 ? "empty" : "cart-items-container"}>
                    {cart.length === 0 ? (
                        <>
                            <p>Your cart is empty</p>
                            <Link to="/Shop"><button onClick={() => { setOpencart(false) }}>Continue Shopping</button></Link>
                        </>
                    ) : (
                        <>
                            <div className="cart-items">
                                {cart.map((item, index) => (
                                    <div className="cart-card" id='cart-card' key={item.cart_item_id || index}>
                                        <div className='cart-image'>
                                            <img onClick={() => { navigate(`/clothes/${item.id}`); setOpencart(false); }} className='pop-img' src={item.image} alt={item.title} />
                                        </div>
                                        <div className='cart-info'>
                                            <p className='product-name' onClick={() => { navigate(`/clothes/${item.id}`); setOpencart(false); }}>{item.title}</p>
                                            <div className='cart-item-details'>
                                                <span className='item-size'>Size: {item.size}</span>
                                            </div>
                                            <div className='cart-btn'>
                                                <p className='product-price' id='add-pri'>₹{item.price}</p>
                                                <div className='quantity-controls'>
                                                    <button onClick={() => updateQuantity(item.cart_item_id, (item.quantity || 1) - 1)}>-</button>
                                                    <span>{item.quantity || 1}</span>
                                                    <button onClick={() => updateQuantity(item.cart_item_id, (item.quantity || 1) + 1)}>+</button>
                                                </div>
                                            </div>
                                            <button
                                                className="del"
                                                onClick={() => removeFromCart(item.cart_item_id || index)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className='cart-footer'>
                                <div className='cart-total'>
                                    <span>Total:</span>
                                    <span>₹{calculateTotal()}</span>
                                </div>
                                <button className='checkout-btn' onClick={handleCheckout}>Checkout</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div >
    );
}

export default Addtocart;
