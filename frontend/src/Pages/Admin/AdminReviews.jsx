import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';

function AdminReviews() {
    const { session } = useUser();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/reviews/admin/all", {
                headers: { Authorization: `Bearer ${session.access_token}` }
            });
            const data = await res.json();
            setReviews(data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this review?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/reviews/admin/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${session.access_token}` }
            });
            if (res.ok) fetchReviews();
        } catch (error) { console.error(error); }
    };

    if (loading) return <p>Loading reviews...</p>;

    return (
        <div className="admin-reviews">
            <div className="admin-header-flex">
                <h2>Customer Feedback</h2>
                <span>Recent Reviews</span>
            </div>

            <div className="admin-card">
                {reviews.length === 0 ? <p style={{ padding: '40px', textAlign: 'center' }}>No reviews yet.</p> : (
                    <div className="reviews-list">
                        {reviews.map(rev => (
                            <div key={rev.id} className="admin-review-item">
                                <div className="review-meta">
                                    <span style={{ fontWeight: '600', color: '#1e293b' }}>{rev.profiles?.full_name || 'Anonymous User'}</span>
                                    <span>{new Date(rev.created_at).toLocaleDateString()}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', marginTop: '10px' }}>
                                    <img src={rev.products?.image} alt="" style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '8px' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '4px' }}>on {rev.products?.title}</div>
                                        <div style={{ marginBottom: '8px' }}>
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <span key={i} style={{ color: i < rev.rating ? '#fbbf24' : '#e2e8f0' }}>★</span>
                                            ))}
                                        </div>
                                        <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>"{rev.comment}"</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(rev.id)}
                                        style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminReviews;
