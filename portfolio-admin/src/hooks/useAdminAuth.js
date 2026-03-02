import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAdminAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            setIsAuthenticated(false);
        } else {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('adminToken', token);
        setIsAuthenticated(true);
        navigate('/'); // Redirect to dashboard after successful login
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return { isAuthenticated, isLoading, login, logout };
}
