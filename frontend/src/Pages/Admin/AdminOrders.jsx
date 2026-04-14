import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';

function AdminOrders() {
    const { isAdmin, session } = useUser();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllOrders = async () => {
        if (!isAdmin) return;
        try {
            const res = await fetch("http://localhost:5000/api/orders/all", {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setOrders(data);
            } else {
                console.warn("Received non-array data from orders API:", data);
                setOrders([]);
            }
        } catch (error) {
            console.error("Error fetching admin orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, [isAdmin]);

    if (!isAdmin) return <div style={{ padding: '20px', textAlign: 'center' }}>Access Denied</div>;

    return (
        <div className="admin-orders-container">
            <div className="admin-header-flex">
                <h2>Order Management</h2>
                <span>Total Orders: {orders.length}</span>
            </div>
            {loading ? <p>Loading orders...</p> : (
                <div className="orders-list">
                    {orders.length === 0 ? <p style={{ textAlign: 'center', padding: '40px' }}>No orders placed yet.</p> : orders.map(order => (
                        <div key={order.id} className="admin-card" style={{ marginBottom: '20px', padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                <span>Order ID: {order.id.slice(0, 8)}...</span>
                                <span>User: {order.profiles?.full_name || 'Generic User'}</span>
                            </div>
                            <div className="order-items-grid" style={{ display: 'grid', gap: '15px' }}>
                                {order.order_items ? order.order_items.map(item => (
                                    <div key={item.id} style={{ display: 'flex', gap: '15px', alignItems: 'center', background: '#fcfcfc', padding: '10px', borderRadius: '8px' }}>
                                        {item.products?.image && <img src={item.products.image} alt={item.products.title} style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px' }} />}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '600' }}>{item.products?.title || 'Product'}</div>
                                            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Size: {item.size} | Qty: {item.quantity}</div>
                                        </div>
                                        <div style={{ fontWeight: 'bold' }}>₹{item.price_at_order}</div>
                                    </div>
                                )) : <p style={{ fontSize: '0.8rem', color: '#999' }}>Item details loading...</p>}
                            </div>
                            <div style={{ marginTop: '15px', fontSize: '0.85rem', color: '#888', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ marginBottom: '8px' }}>
                                        Status: <span style={{ padding: '4px 8px', borderRadius: '4px', background: '#e9ecef', color: '#495057', fontSize: '0.8rem', fontWeight: 'bold' }}>{order.status}</span>
                                        <span style={{ marginLeft: '15px' }}>Date: {new Date(order.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ color: '#333' }}>Location: {order.address} | Phone: {order.phone}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: '#64748b', marginBottom: '4px' }}>Payment: {order.payment_method}</div>
                                    <div style={{ fontWeight: '600', color: '#333' }}>Total: ₹{order.total_price}</div>
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
