import { useState, useContext, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Lock, User, Hexagon, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, token } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) navigate('/dashboard');
    }, [token, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(username, password);
        setLoading(false);
        
        if (result.success) {
            toast.success("Authentication successful");
            navigate('/dashboard');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'var(--bg-app)',
            marginLeft: 'calc(-1 * var(--sidebar-width))'
        }}>
            <div className="surface-card" style={{ 
                width: '100%', 
                maxWidth: '440px', 
                padding: '48px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#eff6ff', marginBottom: '24px' }}>
                        <Hexagon size={36} color="var(--brand-primary)" fill="var(--brand-primary)" fillOpacity={0.2} />
                    </div>
                    <h1 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Enter your credentials to access the system.</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="input-group" style={{ margin: 0 }}>
                        <label className="input-label">Username</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px', color: 'var(--text-tertiary)' }}>
                                <User size={18} />
                            </div>
                            <input 
                                className="premium-input" 
                                type="text" 
                                required 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                placeholder="admin"
                                style={{ paddingLeft: '44px' }}
                            />
                        </div>
                    </div>

                    <div className="input-group" style={{ margin: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label className="input-label">Password</label>
                            <Link to="/forgot-password" style={{ fontSize: '13px', color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</Link>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px', color: 'var(--text-tertiary)' }}>
                                <Lock size={18} />
                            </div>
                            <input 
                                className="premium-input" 
                                type="password" 
                                required 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="••••••••"
                                style={{ paddingLeft: '44px' }}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={loading}
                        style={{ width: '100%', marginTop: '12px', padding: '14px', fontSize: '15px' }}
                    >
                        {loading ? 'Authenticating...' : (
                            <>Sign In <ArrowRight size={16} /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;