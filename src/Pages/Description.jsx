import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Nav from "../Components/Nav";
import '../css/Des.css'
import Footer from "../Components/Footer";

export default function Description({cart, setCart}) {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    const [selectedSize, setSelectedSize] = useState(null);
    const [toast, setToast] = useState(false);

    const [rating, setRating] = useState("4.5");
    const [colors, setColors] = useState([]);

    useEffect(() => {
        let mounted = true;

        fetch(`https://api-com.up.railway.app/api/clothes/${id}`)
            .then(res => res.json())
            .then(data => {
                if (!mounted) return;
                setProduct(data);

                const r = (Math.random() * 1 + 4).toFixed(1);
                setRating(r);

                const palette = ["#000000", "#c0392b", "#2980b9", "#27ae60", "#8e44ad", "#f39c12", "#666666"];
                const arr = palette.slice();
                for (let i = arr.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }
                setColors(arr.slice(0, 3));
            });

        return () => { mounted = false };
    }, [id]);

    if (!product) return <p className="loading">Loading...</p>;

    const numericRating = parseFloat(rating);
    const fullStars = Math.floor(numericRating);
    const starChars = "★".repeat(fullStars) + "☆".repeat(5 - fullStars);

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
                            <div className="rating-row">
                                <div className="stars">{starChars}</div>
                                <span className="rating-number">{rating} / 5</span>
                            </div>
                        </div>

                        <div className="mobile-header-right">
                            <p className="desc-price">{product.price}</p>
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
                        <div className="color-box">
                            {colors.map((c, i) => (
                                <button key={i} className="color-dot" style={{ background: c }} />
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

            { toast && (
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
