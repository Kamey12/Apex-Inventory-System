import { useEffect, useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import { UserPlus, Shield } from 'lucide-react';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ username: '', password: '', role: 'staff' });

    const fetchUsers = async () => {
        try {
            const { data } = await API.get('/auth/users');
            setUsers(data);
        } catch (error) { 
            console.log(error);
            toast.error("Failed to load users"); }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/register', formData);
            toast.success("Account Provisioned");
            setFormData({ username: '', password: '', role: 'staff' });
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Provisioning failed");
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Access Management</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-xl)', alignItems: 'start' }}>
                <div className="surface-card">
                    <h3 style={{ marginBottom: 'var(--space-lg)' }}>Provision Account</h3>
                    <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="input-group">
                            <label className="input-label">Username</label>
                            <input className="premium-input" type="text" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Temporary Password</label>
                            <input className="premium-input" type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Access Level</label>
                            <select className="premium-input" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                                <option value="staff">Standard Staff</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }}>
                            <UserPlus size={16} /> Create User
                        </button>
                    </form>
                </div>

                <div className="surface-card table-container" style={{ padding: 0 }}>
                    <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border-subtle)' }}>
                        <h3>Active Identities</h3>
                    </div>
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Identity</th>
                                <th>Access Level</th>
                                <th style={{ textAlign: 'right' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id}>
                                    <td style={{ fontWeight: 500 }}>{u.username}</td>
                                    <td>
                                        {u.role === 'admin' ? (
                                            <span className="badge badge-neutral"><Shield size={12} /> Administrator</span>
                                        ) : (
                                            <span className="badge badge-neutral">Staff</span>
                                        )}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <span className="badge badge-success">Active</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersPage;