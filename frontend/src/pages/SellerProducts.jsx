import React from 'react';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2 } from 'lucide-react';
import './SellerProducts.css';

const SellerProducts = () => {
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [showModal, setShowModal] = React.useState(false);
    const [editingProduct, setEditingProduct] = React.useState(null); // Track editing state
    const [newProduct, setNewProduct] = React.useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        status: 'Active',
        image: null
    });

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('sellerToken');
            const response = await fetch('http://localhost:8000/api/products', {
                headers: { 'x-auth-token': token }
            });
            const data = await response.json();
            if (response.ok) {
                setProducts(data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        if (e.target.name === 'image') {
            setNewProduct({ ...newProduct, image: e.target.files[0] });
        } else {
            setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setNewProduct({
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock,
            status: product.status,
            image: null // Reset image input on edit (optional: keep ref if needed but file input is read-only)
        });
        setShowModal(true);
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('sellerToken');
            const formData = new FormData();
            formData.append('name', newProduct.name);
            formData.append('category', newProduct.category);
            formData.append('price', newProduct.price);
            formData.append('stock', newProduct.stock);
            formData.append('status', newProduct.status);
            if (newProduct.image) {
                formData.append('image', newProduct.image);
            }

            let url = 'http://localhost:8000/api/products';
            let method = 'POST';

            if (editingProduct) {
                url = `http://localhost:8000/api/products/${editingProduct.id}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'x-auth-token': token
                },
                body: formData
            });

            if (response.ok) {
                setShowModal(false);
                setNewProduct({ name: '', category: '', price: '', stock: '', status: 'Active', image: null });
                setEditingProduct(null); // Clear editing state
                fetchProducts(); // Refresh list
            } else {
                alert('Failed to save product');
            }
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        setNewProduct({ name: '', category: '', price: '', stock: '', status: 'Active', image: null });
    };

    return (
        <div className="seller-products">
            <div className="page-header">
                <div>
                    <h1>Products</h1>
                    <p>Manage your product inventory</p>
                </div>
                <button className="btn-primary" onClick={() => { setEditingProduct(null); setShowModal(true); }}>
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleSaveProduct}>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <input type="text" name="category" value={newProduct.category} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Product Image {editingProduct && '(Leave blank to keep existing)'}</label>
                                <input type="file" name="image" onChange={handleInputChange} accept="image/*" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input type="number" name="stock" value={newProduct.stock} onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select name="status" value={newProduct.status} onChange={handleInputChange}>
                                    <option value="Active">Active</option>
                                    <option value="Draft">Draft</option>
                                    <option value="Out of Stock">Out of Stock</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn-primary">{editingProduct ? 'Update Product' : 'Save Product'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="products-controls">
                <div className="search-bar">
                    <Search size={20} />
                    <input type="text" placeholder="Search products..." />
                </div>
                <button className="btn-secondary">
                    <Filter size={20} />
                    Filter
                </button>
            </div>

            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center p-4">Loading products...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan="6" className="text-center p-4">No products found. Add one to get started!</td></tr>
                        ) : (
                            products.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="product-cell">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="product-img-thumb" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '4px', marginRight: '10px' }} />
                                            ) : (
                                                <div className="product-img-placeholder"></div>
                                            )}
                                            <div>
                                                <p className="product-name">{item.name}</p>
                                                <span className="product-sku">SKU-{item.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{item.category}</td>
                                    <td>₹{item.price}</td>
                                    <td>{item.stock}</td>
                                    <td><span className={`status-badge ${item.status === 'Active' ? 'active' : ''}`}>{item.status}</span></td>
                                    <td>
                                        <div className="actions-cell">
                                            <button className="action-btn" onClick={() => handleEditClick(item)}><Edit size={16} /></button>
                                            <button className="action-btn delete"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SellerProducts;
