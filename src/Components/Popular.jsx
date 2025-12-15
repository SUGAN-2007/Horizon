import { useState} from "react";
import { useNavigate } from "react-router-dom";
import Toast from "./toast";
import '../css/Cart.css'


function Popular({ cart, setCart }) {
    const [toast, setToast] = useState(false);
    const [featpro, setFeatpro] = useState([]);
    const navigate = useNavigate()

    fetch("https://api-com.up.railway.app/api/clothes/category/feature")
        .then(res => res.json())
        .then(data => setFeatpro(data));
    return (
        <>
            <p className="fea-pro">Featured featpro</p>
            <div className="cart">
                {featpro.map(item => (
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
                                <p className='product-price'>{item.price}</p>
                                <button
                                    className="add-btn"
                                    onClick={() => {
                                        setCart([...cart, item]);
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
            {toast && <Toast message={"Added to cart Successfully"} />
            }
        </>
    )
}

export default Popular;