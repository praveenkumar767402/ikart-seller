import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SellerLogin.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would call the backend API to initiate password reset
        console.log("Reset requested for:", email);
        setSubmitted(true);
    };

    return (
        <div className="seller-auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Reset Password</h2>
                    <p>Enter your email to receive instructions</p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="seller@example.com"
                            />
                        </div>
                        <button type="submit" className="auth-btn">Send Reset Link</button>
                    </form>
                ) : (
                    <div className="success-message">
                        <p>If an account exists for {email}, you will receive an email shortly.</p>
                        <button className="auth-btn mt-md" onClick={() => setSubmitted(false)}>Try another email</button>
                    </div>
                )}

                <div className="auth-footer">
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
