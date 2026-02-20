import { useEffect, useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

const HistoryPage = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        API.get('/products/history')
            .then(({ data }) => setTransactions(data))
            .catch(() => toast.error("Failed to load history"));
    }, []);

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Ledger & History</h1>
            </div>

            <div className="surface-card table-container" style={{ padding: 0 }}>
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Transaction Type</th>
                            <th>Product</th>
                            <th>SKU</th>
                            <th style={{ textAlign: 'right' }}>Net Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((t) => (
                            <tr key={t._id}>
                                <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    {new Date(t.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                </td>
                                <td>
                                    {t.type === 'SALE' ? (
                                        <span className="badge badge-warning"><ArrowDownRight size={12}/> Sale</span>
                                    ) : (
                                        <span className="badge badge-success"><ArrowUpRight size={12}/> Restock</span>
                                    )}
                                </td>
                                <td style={{ fontWeight: 500 }}>{t.product?.name || 'Deleted Asset'}</td>
                                <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t.product?.sku || '—'}</td>
                                <td style={{ textAlign: 'right', fontWeight: 600, color: t.type === 'SALE' ? 'var(--text-primary)' : 'var(--accent-green)' }}>
                                    {t.type === 'SALE' ? '-' : '+'}{t.quantity}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {transactions.length === 0 && (
                    <div style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--text-secondary)' }}>No transactions recorded.</div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;