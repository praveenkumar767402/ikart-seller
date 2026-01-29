import React from 'react';
import { Outlet } from 'react-router-dom';
import SellerSidebar from '../components/SellerSidebar';
import './SellerLayout.css';

const SellerLayout = () => {
    return (
        <div className="seller-layout">
            <SellerSidebar />
            <main className="seller-main">
                <Outlet />
            </main>
        </div>
    );
};

export default SellerLayout;
