import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

function AdminDiscounts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    const fetchProducts = async () => {
        const { data } = await supabase.from('products').select('*').order('title');
        setProducts(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchProducts(); }, []);

    const updateDiscount = async (id, field, value) => {
        setUpdatingId(id);
        const updates = {};
        if (field === 'percent') updates.discount_percent = parseInt(value) || 0;
        if (field === 'expiry') updates.discount_until = value || null;

        const { error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id);

        if (!error) {
            setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
        }
        setUpdatingId(null);
    };

    const isExpired = (date) => date && new Date(date) < new Date();

    const filteredProducts = products.filter(p =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p>Loading discounts...</p>;

    return (
        <div className="admin-discounts">
            <div className="admin-header-flex">
                <h2>Manage Discounts</h2>
                <span>{products.filter(p => p.discount_percent > 0 && !isExpired(p.discount_until)).length} active offers</span>
            </div>

            <div className="admin-card">
                <div style={{ padding: '15px' }}>
                    <input
                        type="text"
                        placeholder="Search products to discount..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="admin-input-full"
                        style={{ padding: '10px', width: '100%', borderRadius: '8px', border: '1px solid #ddd' }}
                    />
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Base Price</th>
                                <th>Discount %</th>
                                <th>Expiry Date</th>
                                <th>Sale Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(p => (
                                <tr key={p.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img src={p.image} alt="" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
                                            <span>{p.title}</span>
                                        </div>
                                    </td>
                                    <td>{p.category}</td>
                                    <td>₹{p.price}</td>
                                    <td>
                                        <input
                                            type="number"
                                            defaultValue={p.discount_percent || 0}
                                            onBlur={(e) => updateDiscount(p.id, 'percent', e.target.value)}
                                            style={{ width: '60px', padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
                                            min="0"
                                            max="100"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            defaultValue={p.discount_until ? p.discount_until.split('T')[0] : ''}
                                            onChange={(e) => updateDiscount(p.id, 'expiry', e.target.value)}
                                            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '12px' }}
                                        />
                                        {isExpired(p.discount_until) && <div style={{ color: 'red', fontSize: '10px', marginTop: '2px' }}>Expired</div>}
                                    </td>
                                    <td>
                                        <strong style={{ color: (p.discount_percent > 0 && !isExpired(p.discount_until)) ? '#10b981' : '#888' }}>
                                            ₹{Math.floor(p.price * (1 - (p.discount_percent || 0) / 100))}
                                        </strong>
                                    </td>
                                    <td>
                                        {updatingId === p.id ? (
                                            <span style={{ fontSize: '12px', color: '#666' }}>Saving...</span>
                                        ) : p.discount_percent > 0 ? (
                                            <button
                                                onClick={() => {
                                                    supabase.from('products').update({ discount_percent: 0, discount_until: null }).eq('id', p.id);
                                                    setProducts(products.map(item => item.id === p.id ? { ...item, discount_percent: 0, discount_until: null } : item));
                                                }}
                                                style={{ padding: '4px 8px', fontSize: '11px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Remove
                                            </button>
                                        ) : (
                                            <span style={{ fontSize: '11px', color: '#999' }}>No discount</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDiscounts;
