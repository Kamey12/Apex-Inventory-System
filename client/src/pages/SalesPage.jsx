import { useEffect, useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import { ShoppingCart, CreditCard, Plus, Trash2 } from 'lucide-react';

const SalesPage = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [qty, setQty] = useState(1);

    useEffect(() => {
        API.get('/products/all').then(({ data }) => setProducts(data));
    }, []);

    const addToCart = () => {
        const product = products.find(p => p._id === selectedId);
        if (!product) return toast.error("Select a product");
        if (product.quantity < qty) return toast.error("Insufficient stock");

        const existing = cart.find(item => item.productId === selectedId);
        if (existing) {
            setCart(cart.map(item => item.productId === selectedId ? { ...item, quantity: item.quantity + Number(qty) } : item));
        } else {
            setCart([...cart, { productId: selectedId, name: product.name, price: product.price, quantity: Number(qty) }]);
        }
        setSelectedId('');
        setQty(1);
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.productId !== productId));
    };

    const handleCheckout = async () => {
        try {
            await API.post('/products/bulk-sell', { items: cart });
            toast.success("Transaction Complete");
            setCart([]);
            const { data } = await API.get('/products/all');
            setProducts(data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Checkout Failed");
        }
    };

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Terminal</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)', alignItems: 'start' }}>
                
                {/* Left Side: Product Selection */}
                <div className="surface-card">
                    <h3 style={{ marginBottom: 'var(--space-lg)' }}>Add to Order</h3>
                    <div className="input-group">
                        <label className="input-label">Product</label>
                        <select className="premium-input" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                            <option value="">-- Select --</option>
                            {products.map(p => (
                                <option key={p._id} value={p._id} disabled={p.quantity === 0}>
                                    {p.name} - ${p.price} ({p.quantity} available)
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Quantity</label>
                        <input className="premium-input" type="number" value={qty} onChange={(e) => setQty(e.target.value)} min="1" />
                    </div>
                    <button onClick={addToCart} className="btn btn-secondary" style={{ width: '100%', marginTop: 'var(--space-md)' }}>
                        <Plus size={16} /> Add Item
                    </button>
                </div>

                {/* Right Side: Order Summary */}
                <div className="surface-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <ShoppingCart size={18} color="var(--text-secondary)" />
                        <h3>Current Order</h3>
                    </div>
                    
                    <div style={{ flex: 1, minHeight: '200px', padding: 'var(--space-lg)' }}>
                        {cart.length === 0 ? (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
                                Order is empty
                            </div>
                        ) : (
                            <table className="premium-table" style={{ margin: '-var(--space-lg)', width: 'calc(100% + var(--space-xl))' }}>
                                <tbody>
                                    {cart.map((item) => (
                                        <tr key={item.productId}>
                                            <td style={{ paddingLeft: 'var(--space-lg)' }}>
                                                <div style={{ fontWeight: 500 }}>{item.name}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.quantity} x ${item.price}</div>
                                            </td>
                                            <td style={{ textAlign: 'right', fontWeight: 500 }}>
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </td>
                                            <td style={{ width: '40px', paddingRight: 'var(--space-lg)' }}>
                                                <button onClick={() => removeFromCart(item.productId)} className="btn-danger-ghost" style={{ border: 'none', cursor: 'pointer', padding: '4px' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div style={{ padding: 'var(--space-lg)', background: 'var(--bg-app)', borderTop: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                            <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Due</span>
                            <span style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}>${cartTotal.toFixed(2)}</span>
                        </div>
                        <button onClick={handleCheckout} disabled={cart.length === 0} className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px' }}>
                            <CreditCard size={18} /> Process Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesPage;