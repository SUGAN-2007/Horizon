import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import '../css/OrderTracker.css';

function OrderTracker({ isOpen, onClose }) {
    const { user, session } = useUser();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && user) {
            fetchOrders();
        }
    }, [isOpen, user]);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/`, {
                headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                },
            });
            const data = await res.json();
            console.log("Tracker Data Received:", data);
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Tracker Fetch Fail:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const getStatusStep = (status) => {
        const steps = ["Pending", "Packing", "Out of Warehouse", "Out for Delivery", "Delivered"];
        return steps.indexOf(status);
    };

    return (
        <div className="tracker-overlay" onClick={onClose}>
            <div className="tracker-content" onClick={e => e.stopPropagation()}>
                <div className="tracker-header">
                    <h3>Track Your Orders</h3>
                    <button className="tracker-close" onClick={onClose}>×</button>
                </div>

                <div className="tracker-body">
                    {loading ? <p>Checking status...</p> : (
                        orders.length === 0 ? <p className="no-orders text-muted">No active orders found.</p> : (
                            <div className="tracker-list">
                                {orders.map(order => (
                                    <div key={order.id} className="tracker-card">
                                        <div className="tracker-card-top">
                                            <span className="order-id">#{order.id.slice(0, 8)}</span>
                                            <span className="order-date">{new Date(order.created_at).toLocaleDateString()}</span>
                                        </div>

                                        <div className="status-timeline">
                                            {["Pending", "Packing", "Warehouse", "Delivery", "Arrived"].map((step, i) => {
                                                const currentStep = getStatusStep(order.status);
                                                let state = "pending";
                                                if (i < currentStep) state = "done";
                                                if (i === currentStep) state = "active";

                                                return (
                                                    <div key={step} className={`timeline-step ${state}`}>
                                                        <div className="step-circle"></div>
                                                        <span className="step-label">{step}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="tracker-items-summary">
                                            {order.order_items?.map(it => (
                                                <div key={it.id} className="mini-item">
                                                    {it.products?.title} (x{it.quantity})
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrderTracker;
