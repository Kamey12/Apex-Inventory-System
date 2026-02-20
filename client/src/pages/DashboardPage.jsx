import { useEffect, useState, useContext } from 'react';
import API from '../api';
import AuthContext from '../context/AuthContext';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Layers, AlertCircle, DollarSign, TrendingUp, Activity, ServerOff } from 'lucide-react';

const DashboardPage = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ 
        totalProducts: 0, lowStockCount: 0, totalStockValue: 0, totalSalesCount: 0,
        categoryData: [], salesTrend: [] 
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/products/dashboard/stats')
           .then(({ data }) => { 
               setStats(data); 
               setLoading(false); 
           })
           .catch(console.error);
    }, []);

    // Derived Data for the Stock Health Chart
    const stockHealth = [
        { name: 'Optimal', count: Math.max(0, stats.totalProducts - stats.lowStockCount) },
        { name: 'Low Stock', count: stats.lowStockCount }
    ];

    const PIE_COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

    if (loading) {
        return (
            <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Activity className="animate-pulse" size={48} color="var(--accent-indigo)" />
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>System Overview</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '14px' }}>Real-time telemetry and financial metrics.</p>
                </div>
                <div style={{ padding: '8px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '20px', fontSize: '13px', fontWeight: 500 }}>
                    Access Level: <span style={{ color: 'var(--accent-indigo)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user?.role || 'User'}</span>
                </div>
            </div>

            {/* TOP METRICS CARDS */}
            <div className="grid-cards">
                <div className="surface-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3>Total Inventory Units</h3>
                        <Layers size={20} color="var(--accent-blue)" />
                    </div>
                    <p className="stat-value" style={{ color: 'var(--text-primary)' }}>{stats.totalProducts}</p>
                </div>
                
                <div className="surface-card" style={{ borderColor: stats.lowStockCount > 0 ? 'rgba(244, 63, 94, 0.3)' : 'var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3>Critical Stock Alerts</h3>
                        <AlertCircle size={20} color="var(--accent-red)" />
                    </div>
                    <p className="stat-value" style={{ color: stats.lowStockCount > 0 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                        {stats.lowStockCount}
                    </p>
                </div>

                {user?.role === 'admin' && (
                    <div className="surface-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h3>Total Asset Valuation</h3>
                            <DollarSign size={20} color="var(--accent-green)" />
                        </div>
                        <p className="stat-value" style={{ color: 'var(--accent-green)' }}>
                            ${stats.totalStockValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                )}

                <div className="surface-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3>Transaction Volume</h3>
                        <TrendingUp size={20} color="var(--accent-gold)" />
                    </div>
                    <p className="stat-value" style={{ color: 'var(--text-primary)' }}>{stats.totalSalesCount}</p>
                </div>
            </div>

            {/* CHARTS SCHEMATICS */}
            <div className="dashboard-grid">
                
                {/* Main Area Chart: Revenue Trend */}
                <div className="surface-card" style={{ height: '420px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: 'var(--space-xl)' }}>7-Day Revenue Trajectory</h3>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        {stats.salesTrend && stats.salesTrend.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.salesTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--accent-indigo)" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="var(--accent-indigo)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', color: 'var(--text-primary)' }}
                                        itemStyle={{ color: 'var(--accent-indigo)', fontWeight: 600 }}
                                        formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="var(--accent-indigo)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                                <ServerOff size={32} style={{ marginBottom: '12px' }} />
                                <p>Insufficient telemetry data</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Doughnut Chart: Category Distribution */}
                <div className="surface-card" style={{ height: '420px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: 'var(--space-md)' }}>Asset Allocation</h3>
                    <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {stats.categoryData && stats.categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.categoryData}
                                        cx="50%" cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {stats.categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}
                                        itemStyle={{ fontWeight: 600, color: 'var(--text-primary)' }}
                                        formatter={(value, name) => [value, name]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-tertiary)' }}>No category data available</div>
                        )}
                    </div>
                    {/* Custom Legend */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                        {stats.categoryData && stats.categoryData.slice(0, 6).map((cat, i) => (
                            <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                                {cat.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Chart: Health Check */}
            <div className="surface-card" style={{ height: '300px' }}>
                <h3 style={{ marginBottom: 'var(--space-xl)' }}>Inventory Health Status</h3>
                <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={stockHealth} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-subtle)" />
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-primary)', fontWeight: 500 }} width={80} />
                        <Tooltip cursor={{ fill: 'var(--bg-app)' }} contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }} />
                        <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={32}>
                            {stockHealth.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.name === 'Low Stock' ? 'var(--accent-red)' : 'var(--accent-blue)'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
};

export default DashboardPage;