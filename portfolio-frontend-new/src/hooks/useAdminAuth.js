"use client";
import { useState, useEffect } from 'react';
import { useRouter, usePathname, redirect } from "next/navigation";


export function useAdminAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

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
        router.push('/'); // Redirect to dashboard after successful login
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        router.push('/login');
    };

    return { isAuthenticated, isLoading, login, logout };
}
