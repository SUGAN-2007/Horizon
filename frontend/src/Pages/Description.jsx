import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Nav from "../Components/Nav";
import '../css/Des.css'
import Footer from "../Components/Footer";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";

export default function Description({ products }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = products.find(p => p.id === parseInt(id));
    const { cart, addToCart } = useCart();
    const { user, session, setShowLogin } = useUser();

    const [selectedSize, setSelectedSize] = useState("M");
    const [quantity, setQuantity] = useState(1);
    const [toast, setToast] = useState(false);

    // Review States
    const [reviews, setReviews] = useState([]);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");
    const [ratingTouched, setRatingTouched] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (id) fetchReviews();
    }, [id]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/reviews/${id}`);
            const data = await res.json();
            setReviews(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        }
    };

    if (!product) return <p className="loading">Loading...</p>;

    const isInCart = cart.some(item => item.id === product.id && item.size === selectedSize);

    const handleAddToCart = () => {
        if (!user) {
            setShowLogin(true);
            return;
        }
        addToCart(product, selectedSize, quantity);
        setToast(true);
        setTimeout(() => setToast(false), 2000);
    };

    const updateQuantity = (val) => {
        if (quantity + val >= 1) {
            setQuantity(quantity + val);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!user) {
            setShowLogin(true);
            return;
        }

        // If user hasn't touched the stars and it's still 5, ask for confirmation
        if (!ratingTouched && newRating === 5) {
            const confirm5 = window.confirm("You are about to submit a 5-star review. Is this correct?");
            if (!confirm5) return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("http://localhost:5000/api/reviews/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    productId: id,
                    rating: newRating,
                    comment: newComment
                }),
            });
            if (res.ok) {
                setNewComment("");
                setNewRating(5);
                setRatingTouched(false);
                fetchReviews();
            }
        } catch (err) {
            console.error("Error submitting review:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const getBreakdown = () => {
        if (!reviews || reviews.length === 0) return [
            { stars: 5, pct: 0 }, { stars: 4, pct: 0 }, { stars: 3, pct: 0 }, { stars: 2, pct: 0 }, { stars: 1, pct: 0 }
        ];

        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(r => counts[r.rating]++);

        return [5, 4, 3, 2, 1].map(s => ({
            stars: s,
            pct: Math.round((counts[s] / reviews.length) * 100)
        }));
    };

    const breakdownData = getBreakdown();
    const averageRating = reviews.length > 0
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : "0";

    return (
        <>
            <Nav products={products} />
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
                        <div className="size-label">Size:</div>
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

                    <div className="quantity-section">
                        <div className="quantity-label">Quantity:</div>
                        <div className="quantity-controls">
                            <button onClick={() => updateQuantity(-1)} className="qty-btn">-</button>
                            <span className="qty-val">{quantity}</span>
                            <button onClick={() => updateQuantity(1)} className="qty-btn">+</button>
                        </div>
                    </div>

                    <div className="des-add-cart">
                        <button
                            className={`add-cart-btn ${!user ? 'guest-btn' : ''} ${isInCart ? 'checkout-btn' : ''}`}
                            onClick={isInCart ? () => navigate('/checkout') : handleAddToCart}
                        >
                            {isInCart ? 'Place Order' : 'Add to Cart'}
                        </button>
                    </div>

                    <div className="details-box">
                        <p><strong>Category:</strong> {product.category}</p>
                        <p><strong>Stock:</strong> In Stock</p>
                        <p><strong>Material:</strong> Premium Fabric</p>
                    </div>

                    <p className="desc-text">{product.description}</p>

                    <div className="detailed-rating-section">
                        <h3 className="rating-heading">Customer Ratings</h3>
                        <div className="rating-overview">
                            <div className="rating-score-box">
                                <span className="big-rating">{averageRating}</span>
                                <div className="stars-mini">
                                    {"★".repeat(Math.round(parseFloat(averageRating)))}
                                    {"☆".repeat(5 - Math.round(parseFloat(averageRating)))}
                                </div>
                                <span className="total-reviews">{reviews.length} reviews</span>
                            </div>
                            <div className="rating-bars">
                                {breakdownData.map((item) => (
                                    <div className="rating-bar-row" key={item.stars}>
                                        <span className="star-label">{item.stars} Star</span>
                                        <div className="bar-bg">
                                            <div className="bar-fill" style={{ width: `${item.pct}%` }}></div>
                                        </div>
                                        <span className="pct-label">{item.pct}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Review Section */}
                    <div className="reviews-section">
                        <h1 className="rating-heading">Customer Reviews</h1>

                        {user ? (
                            <form className="review-form" onSubmit={handleSubmitReview}>
                                <div className="rating-input">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span
                                            key={star}
                                            className={`star-icon ${newRating >= star ? 'active' : ''}`}
                                            onClick={() => {
                                                setNewRating(star);
                                                setRatingTouched(true);
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <textarea
                                    placeholder="Share your experience with this product..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    required
                                />
                                <button type="submit" disabled={submitting}>
                                    {submitting ? 'Submitting...' : 'Post Review'}
                                </button>
                            </form>
                        ) : (
                            <div className="login-to-review">
                                <p>Please <span onClick={() => setShowLogin(true)}>Login</span> to post a review.</p>
                            </div>
                        )}

                        <div className="reviews-list">
                            {reviews.length > 0 ? (
                                reviews.map(rev => (
                                    <div className="review-card" key={rev.id}>
                                        <div className="review-header">
                                            <span className="review-user">{rev.profiles?.full_name || 'Verified User'}</span>
                                            <div className="review-stars">{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</div>
                                        </div>
                                        <p className="review-comment">{rev.comment}</p>
                                        <span className="review-date">{new Date(rev.created_at).toLocaleDateString()}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="no-reviews">No reviews yet. Be the first to share your thoughts!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div >

            {toast && (
                <div className="toast-fixed">
                    <span>✓</span>
                    <span>Added to Cart</span>
                </div>
            )}
        </>
    );
}
