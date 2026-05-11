import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import '../css/Notifications.css';

const Notifications = ({ setOpen }) => {
    const { allNotifs, unreadNotifs, loading, markAsRead, markAllAsRead } = useNotifications();
    const [activeTab, setActiveTab] = useState('All');

    const filteredNotifs = activeTab === 'All'
        ? allNotifs
        : allNotifs.filter(n => n.type === activeTab);

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
                    ) : filteredNotifs.length > 0 ? (
                        filteredNotifs.map(notif => (
                            <div
                                key={notif.id}
                                className={`notif-modal-item ${notif.unread ? 'unread' : ''}`}
                                onClick={() => markAsRead(notif.id)}
                            >
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
                    )}
                </div>

                <div className="notif-modal-footer">
                    <button className="mark-read-modal" onClick={markAllAsRead}>Mark all as read</button>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
