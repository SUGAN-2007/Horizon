import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import Nav from '../../Components/Nav';
import Footer from '../../Components/Footer';
import AdminOrders from './AdminOrders';
import ProductUpload from './ProductUpload';
import AdminProducts from './AdminProducts';
import AdminReviews from './AdminReviews';
import AdminStats from './AdminStats';
import AdminDiscounts from './AdminDiscounts';
import '../../css/Admin.css';

function AdminDashboard() {
    const { isAdmin, user } = useUser();
    const [activeTab, setActiveTab] = useState('dashboard');

    if (!isAdmin || !user) {
        return (
            <div className="access-denied" style={{ padding: '100px', textAlign: 'center' }}>
                <h2>Access Denied</h2>
                <p>Please log in as an administrator to view this page.</p>
            </div>
        );
    }

    return (
        <div className="admin-page-container">
            <Nav />
            <div className="admin-dashboard">
                <aside className="admin-sidebar">
                    <h3>MANAGEMENT</h3>
                    <nav>
                        <button
                            className={activeTab === 'dashboard' ? 'active' : ''}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            Overview
                        </button>
                        <button
                            className={activeTab === 'orders' ? 'active' : ''}
                            onClick={() => setActiveTab('orders')}
                        >
                            Orders
                        </button>
                        <button
                            className={activeTab === 'products' ? 'active' : ''}
                            onClick={() => setActiveTab('products')}
                        >
                            Products
                        </button>
                        <button
                            className={activeTab === 'discounts' ? 'active' : ''}
                            onClick={() => setActiveTab('discounts')}
                        >
                            Discounts
                        </button>
                        <button
                            className={activeTab === 'upload' ? 'active' : ''}
                            onClick={() => setActiveTab('upload')}
                        >
                            New Product
                        </button>
                        <button
                            className={activeTab === 'reviews' ? 'active' : ''}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reviews
                        </button>
                    </nav>
                </aside>
                <main className="admin-content">
                    {activeTab === 'dashboard' && <AdminStats />}
                    {activeTab === 'orders' && <AdminOrders />}
                    {activeTab === 'products' && <AdminProducts />}
                    {activeTab === 'discounts' && <AdminDiscounts />}
                    {activeTab === 'upload' && <ProductUpload />}
                    {activeTab === 'reviews' && <AdminReviews />}
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;
