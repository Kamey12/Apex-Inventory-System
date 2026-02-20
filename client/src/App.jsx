import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext, { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { LayoutDashboard, Package, ShoppingBag, ScrollText, Users, LogOut, Hexagon } from 'lucide-react';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import SalesPage from './pages/SalesPage';
import HistoryPage from './pages/HistoryPage';
import UsersPage from './pages/UsersPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

const PrivateRoute = ({ children }) => {
    const { token } = useContext(AuthContext);
    return token ? children : <Navigate to="/login" />;
};

// SIDEBAR 
const Sidebar = () => {
    const { token, user, logout } = useContext(AuthContext);
    if (!token) return null;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <Hexagon size={28} color="var(--brand-primary)" style={{ marginRight: '12px' }} fill="var(--brand-primary)" fillOpacity={0.2} />
                Apex<span style={{ color: 'var(--brand-primary)' }}>Inventory</span>
            </div>
            
            <nav className="sidebar-nav">
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '16px 16px 8px 16px' }}>
                    Main Menu
                </div>
                
                <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                    <LayoutDashboard size={20} /> Dashboard
                </NavLink>
                <NavLink to="/inventory" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                    <Package size={20} /> Inventory
                </NavLink>
                <NavLink to="/sales" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                    <ShoppingBag size={20} /> Point of Sale
                </NavLink>

                {user?.role === 'admin' && (
                    <>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '24px 16px 8px 16px' }}>
                            Administration
                        </div>
                        <NavLink to="/history" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                            <ScrollText size={20} /> Reports
                        </NavLink>
                        <NavLink to="/users" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                            <Users size={20} /> Access Control
                        </NavLink>
                    </>
                )}
            </nav>

            <div className="sidebar-footer">
                <button onClick={logout} className="btn btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', color: 'var(--text-secondary)' }}>
                    <LogOut size={18} /> Sign Out
                </button>
            </div>
        </aside>
    );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Sidebar />
        
        <main className="main-content">
            <ToastContainer 
                position="bottom-right" 
                autoClose={3000} 
                hideProgressBar 
                toastStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid var(--border-subtle)', fontFamily: 'inherit' }}
            />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                <Route path="/inventory" element={<PrivateRoute><InventoryPage /></PrivateRoute>} />
                <Route path="/sales" element={<PrivateRoute><SalesPage /></PrivateRoute>} />
                <Route path="/history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
                <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;