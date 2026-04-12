import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import Nav from '../../Components/Nav';
import Footer from '../../Components/Footer';

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
            setOrders(data);
        } catch (error) {
            console.error("Error fetching admin orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, [isAdmin]);

    if (!isAdmin) return <div style={{ padding: '100px', textAlign: 'center' }}>Access Denied</div>;

    return (
        <>
            <Nav />
            <div className="admin-orders-page" style={{ padding: '100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '30px' }}>📦 Admin Order Management</h1>
                {loading ? <p>Loading orders...</p> : (
                    <div className="orders-list">
                        {orders.length === 0 ? <p>No orders placed yet.</p> : orders.map(order => (
                            <div key={order.id} style={{
                                border: '1px solid #ddd',
                                padding: '20px',
                                borderRadius: '12px',
                                marginBottom: '20px',
                                background: '#f9f9f9'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontWeight: 'bold' }}>
                                    <span>Order ID: {order.id.slice(0, 8)}...</span>
                                    <span>User: {order.profiles?.full_name || order.user_id}</span>
                                    <span style={{ color: 'green' }}>Total: ₹{order.total_price}</span>
                                </div>
                                <div className="order-items-grid" style={{ display: 'grid', gap: '10px' }}>
                                    {order.order_items.map(item => (
                                        <div key={item.id} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                            <img src={item.products.image} alt={item.products.title} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                                            <span>{item.products.title}</span>
                                            <span>Size: {item.size}</span>
                                            <span>Qty: {item.quantity}</span>
                                            <span>Price: ₹{item.price_at_order}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default AdminOrders;
