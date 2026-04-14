import { useState } from 'react';
import { useUser } from '../../context/UserContext';

function ProductUpload() {
    const { session } = useUser();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [product, setProduct] = useState({
        title: '',
        description: '',
        category: 'Men',
        price: '',
        image: '',
        sizes: 'S, M, L, XL'
    });

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch("http://localhost:5000/api/products/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(product),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage('Product added successfully!');
                setProduct({
                    title: '',
                    description: '',
                    category: 'Men',
                    price: '',
                    image: '',
                    sizes: 'S, M, L, XL'
                });
            } else {
                setMessage('Error: ' + data.error);
            }
        } catch (error) {
            setMessage('Failed to upload product');
            console.error(error);
        } finally {
            setLoading(false);
        }
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
                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
