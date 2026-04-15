import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import '../css/Notifications.css';

const Notifications = ({ setOpen }) => {
    const { user, session } = useUser();
    const [activeTab, setActiveTab] = useState('All');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/`, {
                headers: { Authorization: `Bearer ${session?.access_token}` }
            });
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Notif fetch fail:", err);
        } finally {
            setLoading(false);
        }
    };

    // Construct notifications from orders and static updates
    const staticNotifs = [
        {
            id: 'new-1',
            title: 'New Collection: Summer 26',
            subtitle: 'Explore 50+ new arrivals in the shop section • Just now',
            type: 'Product',
            unread: true,
            icon: '✨'
        },
        {
            id: 'offer-1',
            title: 'Exclusive 15% Discount',
            subtitle: 'Use code HORIZON15 at checkout for your next order • 2h ago',
            type: 'Offer',
            unread: true,
            icon: '🎟️'
        }
    ];

    const orderNotifs = orders.map(order => ({
        id: order.id,
        title: `Order ${order.status === 'Delivered' ? 'Delivered' : 'Placed Successfully'}`,
        subtitle: `Order #${order.id.slice(0, 8).toUpperCase()} - ₹${order.total_price} • ${new Date(order.created_at).toLocaleDateString()}`,
        type: 'Orders',
        unread: order.status === 'Pending',
        icon: order.status === 'Delivered' ? '✅' : '📦'
    }));

    const allNotifs = [...orderNotifs, ...staticNotifs];
    const filteredNotifs = activeTab === 'All' ? allNotifs : allNotifs.filter(n => n.type === activeTab);

    return (
        <div className="notif-modal-overlay" onClick={() => setOpen(false)}>
            <div className="notif-modal-content" onClick={e => e.stopPropagation()}>
                <div className="notif-modal-header">
                    <h2>Notifications</h2>
                    <button className="notif-close-btn" onClick={() => setOpen(false)}>&times;</button>
                </div>

                <div className="notif-modal-tabs">
                    {['All', 'Orders', 'Product', 'Offer'].map(tab => (
                        <button
                            key={tab}
                            className={`notif-tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="notif-modal-list">
                    {loading ? (
                        <div className="notif-loading">Loading updates...</div>
                    ) : (
                        filteredNotifs.length > 0 ? (
                            filteredNotifs.map(notif => (
                                <div key={notif.id} className={`notif-modal-item ${notif.unread ? 'unread' : ''}`}>
                                    <div className="notif-modal-icon">{notif.icon}</div>
                                    <div className="notif-modal-info">
                                        <p className="notif-modal-title">{notif.title}</p>
                                        <p className="notif-modal-subtitle">{notif.subtitle}</p>
                                    </div>
                                    {notif.unread && <span className="unread-dot-modal"></span>}
                                </div>
                            ))
                        ) : (
                            <div className="notif-empty">No notifications in {activeTab}</div>
                        )
                    )}
                </div>

                <div className="notif-modal-footer">
                    <button className="mark-read-modal">Mark all as read</button>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
