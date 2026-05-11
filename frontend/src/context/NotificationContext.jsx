import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from './UserContext.jsx';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useUser();
    const [orders, setOrders] = useState([]);
    const [readIds, setReadIds] = useState(() => {
        const saved = localStorage.getItem('read_notif_ids');
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
            const channel = subscribeToOrders();
            return () => {
                supabase.removeChannel(channel);
            };
        } else {
            setOrders([]);
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem('read_notif_ids', JSON.stringify(readIds));
    }, [readIds]);

    const fetchOrders = async () => {
        const { data, error } = await supabase
            .from('orders')
            .select('id, status, total_price, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setOrders(data);
        }
        setLoading(false);
    };

    const subscribeToOrders = () => {
        return supabase
            .channel('notification_order_updates')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders',
                    filter: `user_id=eq.${user.id}`
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setOrders(prev => [payload.new, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new : o));
                        if (payload.new.status !== payload.old.status) {
                            setReadIds(prev => prev.filter(id => id !== payload.new.id));
                        }
                    } else if (payload.eventType === 'DELETE') {
                        setOrders(prev => prev.filter(o => o.id === payload.old.id));
                    }
                }
            )
            .subscribe();
    };

    const staticNotifs = [
        {
            id: 'welcome-01',
            title: 'Welcome to Horizon 🔵',
            subtitle: 'Tap to see your new notification system in action!',
            type: 'Product',
            icon: '👋'
        },
        {
            id: 'new-1',
            title: 'New Collection: Summer 26',
            subtitle: 'Explore 50+ new arrivals in the shop section • Just now',
            type: 'Product',
            icon: '✨'
        },
        {
            id: 'offer-1',
            title: 'Exclusive 15% Discount',
            subtitle: 'Use code HORIZON15 at checkout for your next order • 2h ago',
            type: 'Offer',
            icon: '🎟️'
        }
    ];

    const orderNotifs = orders.map(order => ({
        id: order.id,
        title: order.status === 'Delivered' ? 'Order Delivered!' : `Order ${order.status || 'Placed Successfully'}`,
        subtitle: `Order #${order.id.slice(0, 8).toUpperCase()} — ₹${order.total_price} • ${new Date(order.created_at).toLocaleDateString()}`,
        type: 'Orders',
        icon: order.status === 'Delivered' ? '✅' : order.status === 'Out for Delivery' ? '🚚' : '📦',
        forceUnread: order.status === 'Pending' || order.status === 'Packing' || order.status === 'Out for Delivery'
    }));

    const allNotifs = [...orderNotifs, ...staticNotifs].map(n => ({
        ...n,
        unread: !readIds.includes(n.id) && (n.forceUnread !== undefined ? n.forceUnread : true)
    }));

    const unreadNotifs = allNotifs.filter(n => n.unread);
    const unreadCount = unreadNotifs.length;

    const markAsRead = (id) => {
        if (!readIds.includes(id)) {
            setReadIds([...readIds, id]);
        }
    };

    const markAllAsRead = () => {
        const allIds = allNotifs.map(n => n.id);
        setReadIds(prev => Array.from(new Set([...prev, ...allIds])));
    };

    return (
        <NotificationContext.Provider value={{
            allNotifs,
            unreadNotifs,
            unreadCount,
            loading,
            markAsRead,
            markAllAsRead
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
