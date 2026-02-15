import { useParams } from "react-router-dom";
import { useState } from "react";
import Nav from "../Components/Nav";
import '../css/Des.css'
import Footer from "../Components/Footer";

export default function Description({ products, cart, setCart }) {
    const { id } = useParams();
    const [product] = products.filter(p => p.id === parseInt(id));

    const [selectedSize, setSelectedSize] = useState(null);
    const [toast, setToast] = useState(false);

if (!product) return <p className="loading">Loading...</p>;


return (
    <>
        <Nav cart={cart} setCart={setCart} />

        <div className="desc-container">
            <div className="desc-image-box">
                <img src={product.image} alt={product.title} className="desc-img" />
            </div>

            <div className="desc-content">
                <div className="mobile-header">
                    <div className="mobile-header-left">
                        <h1 className="desc-title">{product.title}</h1>

                    </div>

                    <div className="mobile-header-right">
                        <p className="desc-price">₹{product.price}</p>
                    </div>
                </div>

                <div className="options-wrapper">

                    <div className="size-box">
                        {["S", "M", "L", "XL"].map(size => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`size-btn ${selectedSize === size ? "active-size" : ""}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="des-add-cart">
                    <button className="add-cart-btn" onClick={() => {
                        setCart([...cart, product]);
                        setToast(true);
                        setTimeout(() => setToast(false), 1000);
                    }}>
                        Add to Cart
                    </button>
                </div>

                <div className="details-box">
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Stock:</strong> In Stock</p>
                    <p><strong>Material:</strong> Premium Fabric</p>
                </div>

                <p className="desc-text">{product.description}</p>
            </div>
        </div >

        {toast && (
            <div className="toast-fixed">
                <span>✓</span>
                <span>Added to Cart</span>
            </div>
        )
        }
        <Footer />
    </>
);
}
