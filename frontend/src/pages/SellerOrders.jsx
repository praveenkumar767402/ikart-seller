import React from 'react';

const SellerOrders = () => {
    return (
        <div className="seller-dashboard">
            <header className="dashboard-header">
                <h1>Orders</h1>
                <p>Track and manage your customer orders.</p>
            </header>
            <div className="dashboard-content">
                <section className="recent-orders">
                    <div className="placeholder-content">
                        <p>Order List will go here.</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SellerOrders;
