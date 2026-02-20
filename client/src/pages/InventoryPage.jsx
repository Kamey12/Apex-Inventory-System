import { useEffect, useState, useContext } from 'react';
import API from '../api';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, RefreshCw, AlertCircle, Info } from 'lucide-react';

const InventoryPage = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ 
        name: '', sku: '', category: '', price: '', quantity: '', lowStockThreshold: 5 
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const fetchProducts = async () => {
        try {
            const { data } = await API.get('/products/all');
            setProducts(data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load inventory");
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleEditClick = (product) => {
        setIsEditing(true);
        setEditId(product._id);
        setFormData({
            name: product.name, sku: product.sku, category: product.category,
            price: product.price, quantity: product.quantity, lowStockThreshold: product.lowStockThreshold || 5
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditId(null);
        setFormData({ name: '', sku: '', category: '', price: '', quantity: '', lowStockThreshold: 5 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await API.put(`/products/${editId}`, formData);
                toast.success("Product Updated");
                handleCancelEdit();
            } else {
                await API.post('/products/add', formData);
                toast.success("Product Added");
                setFormData({ name: '', sku: '', category: '', price: '', quantity: '', lowStockThreshold: 5 });
            }
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation Failed");
        }
    };

    const handleRestock = async (id) => {
        const amount = window.prompt("Enter quantity to add to stock:");
        if (!amount || isNaN(amount) || amount <= 0) return;
        try {
            await API.patch(`/products/restock/${id}`, { quantityAdded: Number(amount) });
            toast.success("Stock Replenished");
            fetchProducts();
        } catch (error) {
            console.log(error);
            toast.error("Restock failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product permanently?")) return;
        try {
            await API.delete(`/products/${id}`);
            toast.success("Product Deleted");
            fetchProducts();
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Inventory Management</h1>
            </div>

            {user?.role === 'admin' ? (
                <div className="surface-card" style={{ marginBottom: 'var(--space-xl)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
                        <h3>{isEditing ? 'Edit Product' : 'Add New Item'}</h3>
                        {isEditing && (
                            <button onClick={handleCancelEdit} className="btn btn-secondary" style={{ padding: '6px 12px' }}>
                                Cancel
                            </button>
                        )}
                    </div>
                    
                    <form onSubmit={handleSubmit} className="form-grid">
                        <div className="input-group">
                            <label className="input-label">Product Name</label>
                            <input className="premium-input" type="text" required value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">SKU</label>
                            <input className="premium-input" type="text" required value={formData.sku || ''} onChange={(e) => setFormData({...formData, sku: e.target.value})} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Category</label>
                            <input className="premium-input" type="text" required value={formData.category || ''} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Price ($)</label>
                            <input className="premium-input" type="number" required value={formData.price || ''} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Quantity</label>
                            <input className="premium-input" type="number" required value={formData.quantity || ''} onChange={(e) => setFormData({...formData, quantity: e.target.value})} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Alert Limit</label>
                            <input className="premium-input" type="number" required value={formData.lowStockThreshold || ''} onChange={(e) => setFormData({...formData, lowStockThreshold: e.target.value})} />
                        </div>
                        <div className="input-group" style={{ gridColumn: '1 / -1', marginTop: 'var(--space-sm)' }}>
                            <button type="submit" className="btn btn-primary">
                                {isEditing ? <Edit2 size={16} /> : <Plus size={16} />}
                                {isEditing ? 'Update Product' : 'Add Product'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="surface-card" style={{ marginBottom: 'var(--space-xl)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)', color: 'var(--text-secondary)' }}>
                    <Info size={20} />
                    <span style={{ fontSize: '14px' }}>Staff Mode: Inventory operates in read-only mode to preserve data integrity.</span>
                </div>
            )}

            <div className="surface-card table-container" style={{ padding: 0 }}>
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Item Details</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock Status</th>
                            {user?.role === 'admin' && <th style={{ textAlign: 'right' }}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => {
                            const isLowStock = p.quantity <= p.lowStockThreshold;
                            return (
                                <tr key={p._id}>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{p.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{p.sku}</div>
                                    </td>
                                    <td>{p.category}</td>
                                    <td>${p.price?.toFixed(2)}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                            <span style={{ fontWeight: 600, color: isLowStock ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                                                {p.quantity}
                                            </span>
                                            {isLowStock && <span className="badge badge-danger"><AlertCircle size={12} /> Low</span>}
                                        </div>
                                    </td>
                                    
                                    {user?.role === 'admin' && (
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button onClick={() => handleRestock(p._id)} className="btn btn-secondary" style={{ padding: '6px 10px' }} title="Restock">
                                                    <RefreshCw size={14} color="var(--accent-green)" />
                                                </button>
                                                <button onClick={() => handleEditClick(p)} className="btn btn-secondary" style={{ padding: '6px 10px' }} title="Edit">
                                                    <Edit2 size={14} color="var(--text-primary)" />
                                                </button>
                                                <button onClick={() => handleDelete(p._id)} className="btn btn-danger-ghost" style={{ padding: '6px 10px' }} title="Delete">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryPage;