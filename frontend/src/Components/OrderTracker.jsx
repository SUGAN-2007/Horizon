import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNotifications } from '../context/NotificationContext';
import '../css/OrderTracker.css';

function OrderTracker({ isOpen, onClose }) {
    const { user, session } = useUser();
    const { unreadNotifs, markAsRead } = useNotifications();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

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

    const handleOrderClick = (orderId) => {
        markAsRead(orderId);
        setExpandedOrderId(prev => prev === orderId ? null : orderId);
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
                                {orders.map(order => {
                                    const isUnread = unreadNotifs.some(n => n.id === order.id);
                                    const isExpanded = expandedOrderId === order.id;

                                    return (
                                    <div key={order.id} className={`tracker-card ${isExpanded ? 'expanded' : ''}`} onClick={() => handleOrderClick(order.id)} style={{ cursor: 'pointer' }}>
                                        <div className="tracker-card-top">
                                            <span className="order-id">#{order.id.slice(0, 8)}</span>
                                            <span className="order-date">{new Date(order.created_at).toLocaleDateString()}</span>
                                        </div>

                                        <div className="status-timeline">
                                            {["Pending", "Packing", "Warehouse", "Delivery", "Arrived"].map((step, i) => {
                                                const currentStep = getStatusStep(order.status);
                                                let state = "pending";
                                                if (i < currentStep) state = "done";
                                                if (i === currentStep) {
                                                    state = isUnread ? "active unread" : "active";
                                                }

                                                return (
                                                    <div key={step} className={`timeline-step ${state}`}>
                                                        <div className="step-circle"></div>
                                                        <span className="step-label">{step}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {isExpanded ? (
                                            <div className="tracker-bill-detail">
                                                <div className="bill-header">
                                                    <strong>Order Summary</strong>
                                                </div>
                                                <div className="bill-items">
                                                    {order.order_items?.map(it => (
                                                        <div key={it.id} className="bill-item-row">
                                                            <span className="bill-item-title">{it.products?.title} <span className="bill-item-qty">x{it.quantity}</span></span>
                                                            <span className="bill-item-price">₹{it.price_at_order * it.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="bill-footer">
                                                    <span>Total</span>
                                                    <strong>₹{order.total_price}</strong>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="tracker-items-summary">
                                                {order.order_items?.map(it => (
                                                    <div key={it.id} className="mini-item">
                                                        {it.products?.title} (x{it.quantity})
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )})}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrderTracker;
