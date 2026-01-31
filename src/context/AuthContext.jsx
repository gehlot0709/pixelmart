import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initial check
    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    };
                    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, config);
                    setUser(data);
                    setIsAuthenticated(true);
                } catch (error) {
                    localStorage.removeItem('token');
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
        localStorage.setItem('token', data.token);
        setUser(data);
        setIsAuthenticated(true);
        return data;
    };

    const register = async (userData) => {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, userData);
        // Note: Register usually doesn't login immediately if OTP is required.
        // But if it returns token (it won't, controller returns message), we handle flow.
        return data;
    };

    const verifyOTP = async (email, otp) => {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, { email, otp });
        localStorage.setItem('token', data.token);
        setUser(data);
        setIsAuthenticated(true);
        return data;
    };

    const resendOTP = async (email) => {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/resend-otp`, { email });
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, verifyOTP, resendOTP, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
