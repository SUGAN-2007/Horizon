import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

function AdminStats() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        activeReviews: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);

            // Fetch total revenue from delivered/shipped orders
            const { data: orders } = await supabase
                .from('orders')
                .select('total_price, status');

            const { count: productCount } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true });

            const { count: reviewCount } = await supabase
                .from('reviews')
                .select('*', { count: 'exact', head: true });

            const revenue = orders?.reduce((acc, order) => {
                if (order.status !== 'Cancelled') return acc + parseFloat(order.total_price);
                return acc;
            }, 0) || 0;

            setStats({
                totalRevenue: revenue,
                totalOrders: orders?.length || 0,
                totalProducts: productCount || 0,
                activeReviews: reviewCount || 0
            });
            setLoading(false);
        };

        fetchStats();
    }, []);

    if (loading) return <div className="stats-loading">Calculating business insights...</div>;

    return (
        <div className="admin-stats">
            <h2 className="section-title">Business Overview</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon revenue">₹</div>
                    <div className="stat-info">
                        <span className="stat-label">Total Revenue</span>
                        <span className="stat-value">₹{stats.totalRevenue.toLocaleString()}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orders">📦</div>
                    <div className="stat-info">
                        <span className="stat-label">Total Orders</span>
                        <span className="stat-value">{stats.totalOrders}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon products">👕</div>
                    <div className="stat-info">
                        <span className="stat-label">Live Products</span>
                        <span className="stat-value">{stats.totalProducts}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon reviews">⭐</div>
                    <div className="stat-info">
                        <span className="stat-label">Customer Reviews</span>
                        <span className="stat-value">{stats.activeReviews}</span>
                    </div>
                </div>
            </div>

            <div className="revenue-breakdown">
                <h3>Insights</h3>
                <p>Total transaction volume is consistent with current growth trends. Ensure your "Confirmed" orders are processed for shipping within 24 hours to maintain high customer satisfaction.</p>
            </div>
        </div>
    );
}

export default AdminStats;
