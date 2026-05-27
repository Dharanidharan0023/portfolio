"use client";

import { useState } from 'react';
import { useAdminAuth } from "@/hooks/useAdminAuth";
import api from "@/lib/api";

const AdminLogin = () => {
    const { login } = useAdminAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', {
                username,
                password
            });

            login(response.data.token);
        } catch (err) {
            if (!err.response) {
                setError('Network error or CORS issue. Please ensure the backend is running and CORS is configured for port 5174.');
            } else if (err.response.status === 401) {
                setError('Invalid credentials. Please use admin / admin123.');
            } else {
                setError(err.response?.data?.message || 'Comparison failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-background -z-10"></div>
            <div className="glass-card w-full max-w-md p-10 relative overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.15)] border border-white/10">
                {/* Decorative elements */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/40 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>

                <h2 className="text-4xl font-heading font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-secondary-light">
                    Admin Login
                </h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging in...' : 'Login to Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
