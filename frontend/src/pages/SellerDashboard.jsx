import React from 'react';
import { DollarSign, Package, ShoppingBag, TrendingUp } from 'lucide-react';
import './SellerDashboard.css';

const StatCard = ({ title, value, icon: Icon, trend, trendUp }) => (
    <div className="stat-card">
        <div className="stat-header">
            <div className="stat-info">
                <h3>{title}</h3>
                <p className="stat-value">{value}</p>
            </div>
            <div className={`stat-icon ${trendUp ? 'positive' : 'neutral'}`}>
                <Icon size={24} />
            </div>
        </div>
        <div className="stat-footer">
            <span className={`trend ${trendUp ? 'up' : 'down'}`}>
                {trend}
            </span>
            <span className="trend-label">vs last month</span>
        </div>
    </div>
);

const SellerDashboard = () => {
    const [stats, setStats] = React.useState({
        revenue: 0,
        orders: 0,
        products: 0,
        growth: 0
    });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('sellerToken');
                const response = await fetch('/api/seller/stats', {
                    headers: { 'x-auth-token': token }
                });
                const data = await response.json();
                if (response.ok) {
                    setStats(data);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-8">Loading dashboard...</div>;

    return (
        <div className="seller-dashboard">
            <header className="dashboard-header">
                <h1>Dashboard Overview</h1>
                <p>Welcome back! Here's what's happening today.</p>
            </header>

            <div className="stats-grid">
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.revenue?.toLocaleString()}`}
                    icon={DollarSign}
                    trend="+12%"
                    trendUp={true}
                />
                <StatCard
                    title="Total Orders"
                    value={stats.orders?.toLocaleString()}
                    icon={ShoppingBag}
                    trend="+5%"
                    trendUp={true}
                />
                <StatCard
                    title="Active Products"
                    value={stats.products?.toLocaleString()}
                    icon={Package}
                    trend="0%"
                    trendUp={true}
                />
                <StatCard
                    title="Growth"
                    value={`${stats.growth}%`}
                    icon={TrendingUp}
                    trend="+2.4%"
                    trendUp={true}
                />
            </div>

            <div className="dashboard-content">
                <section className="recent-orders">
                    <h2>Recent Orders</h2>
                    <div className="placeholder-content">
                        <p>Order chart or list will go here.</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SellerDashboard;
