import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';
import { Lock, ShieldCheck } from 'lucide-react';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { token } = useParams(); 
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setLoading(true);
        try {
            const { data } = await API.put(`/auth/reset-password/${token}`, { password });
            toast.success(data.message);
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || "Reset failed. Token may be expired.");
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-app)', marginLeft: 'calc(-1 * var(--sidebar-width))' }}>
            <div className="surface-card" style={{ width: '100%', maxWidth: '440px', padding: '48px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#ecfdf5', marginBottom: '24px' }}>
                        <ShieldCheck size={32} color="var(--accent-green)" />
                    </div>
                    <h1 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px' }}>Create New Password</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Your identity has been verified. Please choose a strong password.</p>
                </div>

                <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="input-group" style={{ margin: 0 }}>
                        <label className="input-label">New Password</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px', color: 'var(--text-tertiary)' }}>
                                <Lock size={18} />
                            </div>
                            <input 
                                className="premium-input" type="password" required minLength="6"
                                value={password} onChange={(e) => setPassword(e.target.value)} 
                                placeholder="••••••••" style={{ paddingLeft: '44px' }}
                            />
                        </div>
                    </div>

                    <div className="input-group" style={{ margin: 0 }}>
                        <label className="input-label">Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px', color: 'var(--text-tertiary)' }}>
                                <Lock size={18} />
                            </div>
                            <input 
                                className="premium-input" type="password" required minLength="6"
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
                                placeholder="••••••••" style={{ paddingLeft: '44px' }}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '12px', padding: '14px', fontSize: '15px' }}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;