import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if token exists
        const token = localStorage.getItem('sellerToken');
        if (token) {
            // Ideally verify token with backend here
            const storedUser = JSON.parse(localStorage.getItem('sellerUser'));
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Login failed');

            if (data.user.role !== 'seller' && data.user.role !== 'admin') {
                throw new Error('Unauthorized: Not a seller account');
            }

            localStorage.setItem('sellerToken', data.token);
            localStorage.setItem('sellerUser', JSON.stringify(data.user));
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const signup = async (name, email, password) => {
        try {
            const response = await fetch('http://localhost:8000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role: 'seller' })
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Signup failed');

            // Auto login after signup
            localStorage.setItem('sellerToken', data.token);
            localStorage.setItem('sellerUser', JSON.stringify(data.user));
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('sellerToken');
        localStorage.removeItem('sellerUser');
        setUser(null);
    };

    const value = {
        user,
        login,
        signup,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
