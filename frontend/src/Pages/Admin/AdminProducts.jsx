import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';

function AdminProducts() {
    const { session } = useUser();
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Filter/Sort States
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [limit, setLimit] = useState(10);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/`);
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            if (res.ok) fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${editingProduct.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(editingProduct),
            });
            if (res.ok) {
                setEditingProduct(null);
                fetchProducts();
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Logic for Filtering and Sorting
    const filteredProducts = products.filter(p => {
        const term = searchTerm.toLowerCase();
        if (!term) return true;

        const title = p.title.toLowerCase();
        const titleWords = title.split(' ');
        const cat = p.category.toLowerCase();

        // Check if title or any word in title STARTS with the term
        const startsWithMatch = title.startsWith(term) || titleWords.some(word => word.startsWith(term));

        // Check if title INCLUDES the term (for partial matches)
        const includeMatch = title.includes(term);

        // Category match: Only match category if the search is at least 2 characters long 
        // to prevent every item in "womens" showing up for a single "w" query
        const catMatch = term.length > 1 && cat.startsWith(term);

        return startsWithMatch || includeMatch || catMatch;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'newest') return b.id - a.id;
        if (sortBy === 'oldest') return a.id - b.id;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
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

            {/* Filter Bar */}
            <div className="admin-filters-bar">
                <div className="filter-search">
                    <span className="search-icon-fixed">🔍</span>
                    <input
                        type="text"
                        placeholder="Search items or categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-select-group">
                    <label>Sort By:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
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
                        <div className="form-group">
                            <label>Price (₹)</label>
                            <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} />
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
                                    <th>Stats</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProducts.length === 0 ? (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No matches found for "{searchTerm}"</td></tr>
                                ) : paginatedProducts.map(p => (
                                    <tr key={p.id}>
                                        <td><img src={p.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain' }} /></td>
                                        <td><strong>{p.title}</strong></td>
                                        <td>{p.category}</td>
                                        <td>₹{p.price}</td>
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
