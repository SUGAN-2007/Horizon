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

    // Helper for relative time
    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    useEffect(() => {
        if (id) fetchReviews();
    }, [id, user]);

    const fetchReviews = async () => {
        try {
            const url = `http://localhost:5000/api/reviews/${id}`;
            const res = await fetch(url);
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
                <div className="desc-left">
                    <div className="desc-image-box">
                        <img src={product.image} alt={product.title} className="desc-img" />
                    </div>

                    <div className="detailed-rating-section-left">
                        <h3 className="section-title">Ratings & Breakdown</h3>
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

                    <button className="add-to-cart-btn" onClick={handleAddToCart}>
                        {isInCart ? 'Place Order' : `Add to Cart — ₹${product.price * quantity}`}
                    </button>

                    <div className="product-specs">
                        <div className="spec-row">
                            <span className="spec-label">AVAILABILITY</span>
                            <span className="spec-value stock-status">
                                <span className="pulse-dot"></span> In Stock
                            </span>
                        </div>
                        <div className="spec-row">
                            <span className="spec-label">COLLECTION</span>
                            <span className="spec-value">{product.category || 'Premium Feature'}</span>
                        </div>
                        <div className="spec-row">
                            <span className="spec-label">MATERIAL</span>
                            <span className="spec-value">{product.material || 'Premium Fabric'}</span>
                        </div>
                    </div>

                    <div className="desc-separator"></div>
                    <p className="desc-text-premium">{product.description}</p>
                </div>
            </div>

            <div className="product-footer-section">
                <div className="footer-flex-container">
                    <div className="footer-left-col">
                        <div className="review-submission-box-wide">
                            <h3 className="section-title">Leave Feedback</h3>
                            {user ? (
                                <form className="review-form-simple" onSubmit={handleSubmitReview}>
                                    <div className="rating-input-line">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span
                                                key={star}
                                                className={`star-icon-bw ${newRating >= star ? 'active' : ''}`}
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
                                        placeholder="Write your thoughts..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="post-btn-bw" disabled={submitting}>
                                        {submitting ? 'Posting...' : 'Submit Review'}
                                    </button>
                                </form>
                            ) : (
                                <div className="login-prompt-simple">
                                    <p>Please <span onClick={() => setShowLogin(true)}>Login</span> to review.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="footer-right-col">
                        <div className="reviews-list-compact">
                            <h3 className="section-title">Customer Comments</h3>
                            {reviews.length > 0 ? (
                                <div className="reviews-stack">
                                    {reviews.map(rev => (
                                        <ReviewItem
                                            key={rev.id}
                                            rev={rev}
                                            user={user}
                                            session={session}
                                            refresh={fetchReviews}
                                            timeAgo={timeAgo}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="no-reviews-simple">No comments yet. Be the first.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {toast && (
                <div className="toast-fixed">
                    <span>✓</span>
                    <span>Added to Cart</span>
                </div>
            )}
            <Footer />
        </>
    );
}

// Inner Component for Interactive Reviews
function ReviewItem({ rev, user, session, refresh, timeAgo }) {
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState([]);
    const [replyText, setReplyText] = useState("");
    const [isReplying, setIsReplying] = useState(false);

    const fetchReplies = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/reviews/replies/${rev.id}`);
            const data = await res.json();
            setReplies(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
    };


    const handleReply = async (e) => {
        e.preventDefault();
        if (!user) return alert("Please login to reply");
        try {
            const res = await fetch("http://localhost:5000/api/reviews/reply/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ reviewId: rev.id, comment: replyText }),
            });
            if (res.ok) {
                setReplyText("");
                setIsReplying(false);
                fetchReplies();
                setShowReplies(true);
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div className="review-card-clean">
            <div className="review-card-top">
                <div className="review-user-info">
                    <span className="review-user-name">{rev.name}</span>
                    <span className="review-rating-num">({rev.rating}/5)</span>
                    <span className="review-stars-inline">
                        {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                    </span>
                    <span className="review-date-relative">{timeAgo(rev.created_at)}</span>
                </div>
            </div>

            <p className="review-text-simple">{rev.comment}</p>

            <div className="review-actions">
                <button className="act-btn-txt" onClick={() => setIsReplying(!isReplying)}>Reply</button>

                {rev.reply_count > 0 && !showReplies && (
                    <button className="view-replies-count-btn" onClick={() => {
                        fetchReplies();
                        setShowReplies(true);
                    }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m19 9-7 7-7-7" /></svg>
                        {rev.reply_count} {rev.reply_count === 1 ? 'Reply' : 'Replies'}
                    </button>
                )}
            </div>

            {isReplying && (
                <form className="reply-form-mini" onSubmit={handleReply}>
                    <input
                        type="text"
                        placeholder="Add a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        autoFocus
                        required
                    />
                    <div className="reply-form-btns">
                        <button type="button" className="cancel-reply" onClick={() => setIsReplying(false)}>Cancel</button>
                        <button type="submit" className="post-reply-btn">Reply</button>
                    </div>
                </form>
            )}

            {showReplies && (
                <div className="replies-list-container">
                    <div className="replies-list">
                        {replies.map(rep => (
                            <div key={rep.id} className="reply-item">
                                <div className="reply-header">
                                    <span className="reply-user">{rep.name} </span>
                                    <span className="reply-at">{timeAgo(rep.created_at)}</span>
                                </div>
                                <span className="reply-body">{rep.comment}</span>
                            </div>
                        ))}
                    </div>
                    {replies.length > 0 && (
                        <button className="hide-replies-btn" onClick={() => setShowReplies(false)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m18 15-6-6-6 6" /></svg>
                            Hide Replies
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
