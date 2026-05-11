import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [limit, setLimit] = useState(10);

    const fetchProducts = async () => {
        const { data } = await supabase.from('products').select('*');
        setProducts(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        await supabase.from('products').delete().eq('id', id);
        fetchProducts();
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        await supabase.from('products').update({
            title: editingProduct.title,
            price: editingProduct.price,
            discount_percent: parseInt(editingProduct.discount_percent) || 0,
            image: editingProduct.image,
            description: editingProduct.description,
            category: editingProduct.category,
        }).eq('id', editingProduct.id);
        setEditingProduct(null);
        fetchProducts();
    };

    const filteredProducts = products.filter(p => {
        const term = searchTerm.toLowerCase();
        if (!term) return true;
        return p.title?.toLowerCase().includes(term) || p.category?.toLowerCase().includes(term);
    });

    const getDiscountedPrice = (price, discount) => {
        if (!discount) return price;
        return price - (price * (discount / 100));
    };

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'alphabetical') return a.title?.localeCompare(b.title);
        return 0;
    });

    const paginatedProducts = sortedProducts.slice(0, limit);

    if (loading) return <p>Loading products...</p>;

    return (
        <div className="admin-products">
            <div className="admin-header-flex">
                <h2>Product Inventory</h2>
                <span>Total: {products.length} Items</span>
            </div>

            <div className="admin-filters-bar">
                <div className="filter-search">
                    <span className="search-icon-fixed">🔍</span>
                    <input type="text" placeholder="Search items or categories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="filter-select-group">
                    <label>Sort By:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="newest">Newest First</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="alphabetical">Name (A-Z)</option>
                    </select>
                </div>
                <div className="filter-select-group">
                    <label>Show:</label>
                    <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value))}>
                        <option value={5}>5 Items</option>
                        <option value={10}>10 Items</option>
                        <option value={20}>20 Items</option>
                        <option value={50}>50 Items</option>
                    </select>
                </div>
            </div>

            {editingProduct ? (
                <div className="admin-card">
                    <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                        <h3>Edit Product: {editingProduct.title}</h3>
                        <button onClick={() => setEditingProduct(null)} className="admin-btn-secondary">Cancel</button>
                    </div>
                    <form onSubmit={handleUpdate} className="admin-form">
                        <div className="form-group">
                            <label>Product Title</label>
                            <input type="text" value={editingProduct.title} onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label>Price (₹)</label>
                                <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Discount (%)</label>
                                <input type="number" value={editingProduct.discount_percent || 0} onChange={(e) => setEditingProduct({ ...editingProduct, discount_percent: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Image URL</label>
                            <input type="text" value={editingProduct.image} onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })} />
                        </div>
                        <button type="submit" className="admin-btn-primary">Save Changes</button>
                    </form>
                </div>
            ) : (
                <div className="admin-card">
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Product Title</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Discount</th>
                                    <th>Stats</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProducts.length === 0 ? (
                                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No matches found for "{searchTerm}"</td></tr>
                                ) : paginatedProducts.map(p => (
                                    <tr key={p.id}>
                                        <td><img src={p.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain' }} /></td>
                                        <td><strong>{p.title}</strong></td>
                                        <td>{p.category}</td>
                                        <td>
                                            {p.discount_percent > 0 ? (
                                                <div>
                                                    <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '0.8rem' }}>₹{p.price}</span>
                                                    <div style={{ color: '#000', fontWeight: 'bold' }}>₹{getDiscountedPrice(p.price, p.discount_percent).toFixed(0)}</div>
                                                </div>
                                            ) : (
                                                <span>₹{p.price}</span>
                                            )}
                                        </td>
                                        <td><span style={{ color: p.discount_percent > 0 ? '#10b981' : '#888' }}>{p.discount_percent || 0}%</span></td>
                                        <td>Rate: {p.rating_rate} ({p.rating_count})</td>
                                        <td style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => setEditingProduct(p)} style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
                                            <button onClick={() => handleDelete(p.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProducts;
