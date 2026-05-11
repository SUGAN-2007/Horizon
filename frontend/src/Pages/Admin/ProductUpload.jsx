import { useState } from 'react';
import { supabase } from '../../lib/supabase';

function ProductUpload() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [product, setProduct] = useState({
        title: '',
        description: '',
        category: 'Men',
        price: '',
        discount_percent: 0,
        image: '',
        sizes: 'S, M, L, XL'
    });

    const handleChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const { error } = await supabase.from('products').insert([{
            title: product.title,
            description: product.description,
            category: product.category,
            price: parseFloat(product.price),
            discount_percent: parseInt(product.discount_percent) || 0,
            image: product.image,
            sizes: product.sizes.split(',').map(s => s.trim()),
        }]);

        if (!error) {
            setMessage('✅ Product added successfully!');
            setProduct({ title: '', description: '', category: 'Men', price: '', discount_percent: 0, image: '', sizes: 'S, M, L, XL' });
        } else {
            setMessage('❌ Error: ' + error.message);
        }
        setLoading(false);
    };

    return (
        <div className="product-upload">
            <div className="admin-header-flex">
                <h2>Add New Product</h2>
            </div>
            <div className="admin-card">
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label>Product Title</label>
                        <input type="text" name="title" value={product.title} onChange={handleChange} required placeholder="e.g. Blue Denim Jacket" />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" value={product.description} onChange={handleChange} required placeholder="Product details..." />
                    </div>
                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" value={product.category} onChange={handleChange}>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Kids">Kids</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Price (₹)</label>
                            <input type="number" name="price" value={product.price} onChange={handleChange} required placeholder="999" />
                        </div>
                        <div className="form-group">
                            <label>Discount (%)</label>
                            <input type="number" name="discount_percent" value={product.discount_percent} onChange={handleChange} placeholder="0" min="0" max="100" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input type="text" name="image" value={product.image} onChange={handleChange} required placeholder="https://example.com/image.jpg" />
                    </div>
                    <div className="form-group">
                        <label>Sizes (comma separated)</label>
                        <input type="text" name="sizes" value={product.sizes} onChange={handleChange} required placeholder="S, M, L, XL" />
                    </div>
                    <button type="submit" className="admin-btn-primary" disabled={loading} style={{ width: '100%' }}>
                        {loading ? 'Uploading...' : 'Upload Product'}
                    </button>
                    {message && <p className="form-message" style={{ marginTop: '20px', textAlign: 'center', fontWeight: 'bold' }}>{message}</p>}
                </form>
            </div>
        </div>
    );
}

export default ProductUpload;
