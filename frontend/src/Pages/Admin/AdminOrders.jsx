import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { supabase } from '../../lib/supabase';

function AdminOrders() {
    const { isAdmin } = useUser();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusUpdates, setStatusUpdates] = useState({});

    const fetchAllOrders = async () => {
        if (!isAdmin) return;
        const { data, error } = await supabase
            .from('orders')
            .select('*, profiles(full_name, phone, email), order_items(*, products(title, image))')
            .order('created_at', { ascending: false });

        setOrders(!error && Array.isArray(data) ? data : []);
        setLoading(false);
    };

    useEffect(() => { fetchAllOrders(); }, [isAdmin]);

    const handleStatusChange = (orderId, newStatus) => {
        setStatusUpdates(prev => ({ ...prev, [orderId]: newStatus }));
    };

    const confirmStatusUpdate = async (orderId) => {
        const newStatus = statusUpdates[orderId];
        if (!newStatus) return;

        // Optimistic update
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        setStatusUpdates(prev => {
            const next = { ...prev };
            delete next[orderId];
            return next;
        });

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/status/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token}`,
                    "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to update');
            }
        } catch (error) {
            alert('Failed to update status: ' + error.message);
            fetchAllOrders();
        }
    };

    if (!isAdmin) return <div style={{ padding: '20px', textAlign: 'center' }}>Access Denied</div>;

    const statusOptions = ["Pending", "Packing", "Out of Warehouse", "Out for Delivery", "Delivered"];

    return (
        <div className="admin-orders-container">
            <div className="admin-header-flex">
                <h2>Order Management</h2>
                <span>Total Orders: {orders.length}</span>
            </div>
            {loading ? <p>Loading orders...</p> : (
                <div className="orders-list">
                    {orders.length === 0
                        ? <p style={{ textAlign: 'center', padding: '40px' }}>No orders placed yet.</p>
                        : orders.map(order => (
                            <div key={order.id} className="admin-card" style={{ marginBottom: '20px', padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                    <span>Order ID: {order.id.slice(0, 8)}...</span>
                                    <span>
                                        Customer: {order.profiles?.full_name || 'Generic User'}
                                        <span style={{ fontWeight: 'normal', color: '#64748b', marginLeft: '10px', fontSize: '0.85rem' }}>
                                            ({order.profiles?.email || 'No Email'})
                                        </span>
                                    </span>
                                </div>
                                <div className="order-items-grid" style={{ display: 'grid', gap: '15px' }}>
                                    {order.order_items?.map(item => (
                                        <div key={item.id} style={{ display: 'flex', gap: '15px', alignItems: 'center', background: '#fcfcfc', padding: '10px', borderRadius: '8px' }}>
                                            {item.products?.image && <img src={item.products.image} alt={item.products.title} style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px' }} />}
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '600' }}>{item.products?.title || 'Product'}</div>
                                                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Size: {item.size} | Qty: {item.quantity}</div>
                                            </div>
                                            <div style={{ fontWeight: 'bold' }}>₹{item.price_at_order}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '15px', fontSize: '0.85rem', color: '#888', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span>Status:</span>
                                            <select
                                                value={statusUpdates[order.id] || order.status || 'Pending'}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff' }}
                                            >
                                                {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>

                                            {statusUpdates[order.id] && statusUpdates[order.id] !== order.status && (
                                                <button
                                                    onClick={() => confirmStatusUpdate(order.id)}
                                                    style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '6px',
                                                        background: '#000',
                                                        color: '#fff',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    Confirm
                                                </button>
                                            )}

                                            <span style={{ marginLeft: '15px' }}>Date: {new Date(order.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div style={{ color: '#333' }}>Location: {order.address} | Phone: {order.phone}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: '#64748b', marginBottom: '4px' }}>Payment: {order.payment_method}</div>
                                        <div style={{ fontWeight: '600', color: '#333', fontSize: '1.1rem' }}>Total: ₹{order.total_price}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}

export default AdminOrders;
