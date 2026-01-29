import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './SellerSidebar.css';

const SellerSidebar = () => {
    const { logout } = useAuth();
    return (
        <aside className="seller-sidebar">
            <div className="sidebar-header">
                <h3>Seller Portal</h3>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/products" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <Package size={20} />
                    <span>Products</span>
                </NavLink>

                <NavLink to="/orders" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <ShoppingBag size={20} />
                    <span>Orders</span>
                </NavLink>

                <div className="nav-divider"></div>

                <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={logout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default SellerSidebar;
