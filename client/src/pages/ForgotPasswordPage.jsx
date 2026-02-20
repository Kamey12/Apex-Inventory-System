import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';
import { KeyRound, User, ArrowLeft, Send } from 'lucide-react';

const ForgotPasswordPage = () => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await API.post('/auth/forgot-password', { username });
            toast.info("Development Mode: Redirecting to secure reset link...", { autoClose: 4000 });
            
            setTimeout(() => {
                navigate(data.resetUrl);
            }, 1500);

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to process request");
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-app)', marginLeft: 'calc(-1 * var(--sidebar-width))' }}>
            <div className="surface-card" style={{ width: '100%', maxWidth: '440px', padding: '48px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', marginBottom: '32px', fontWeight: 500 }}>
                    <ArrowLeft size={16} /> Back to login
                </Link>

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#eff6ff', marginBottom: '24px' }}>
                        <KeyRound size={32} color="var(--brand-primary)" />
                    </div>
                    <h1 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px' }}>Reset Password</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Enter your username and we will generate a secure reset token.</p>
                </div>

                <form onSubmit={handleRequestReset} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="input-group" style={{ margin: 0 }}>
                        <label className="input-label">Username</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px', color: 'var(--text-tertiary)' }}>
                                <User size={18} />
                            </div>
                            <input 
                                className="premium-input" type="text" required 
                                value={username} onChange={(e) => setUsername(e.target.value)} 
                                placeholder="Enter your username" style={{ paddingLeft: '44px' }}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '12px', padding: '14px', fontSize: '15px' }}>
                        {loading ? 'Processing...' : <><Send size={16} /> Send Reset Link</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;