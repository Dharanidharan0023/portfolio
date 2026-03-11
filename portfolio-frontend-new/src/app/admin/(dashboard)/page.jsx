"use client";

import { useState, useEffect } from 'react';
import api from "@/lib/api";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        visitors: 0,
        projects: 0,
        messages: 0,
        experience: 0,
        skills: 0,
        education: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [visitorsRes, projectsRes, messagesRes, expRes, eduRes, skillsRes] = await Promise.all([
                    api.get('/visitors/stats'),
                    api.get('/projects'),
                    api.get('/messages'),
                    api.get('/experiences'),
                    api.get('/educations'),
                    api.get('/skills')
                ]);

                setStats({
                    visitors: visitorsRes.data?.TotalVisitors || 0,
                    projects: projectsRes.data?.length || 0,
                    messages: messagesRes.data?.filter(m => !m.isRead)?.length || 0,
                    experience: expRes.data?.length || 0,
                    education: eduRes.data?.length || 0,
                    skills: skillsRes.data?.length || 0
                });
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="text-white">Loading dashboard...</div>;

    const statCards = [
        { label: 'Total Views', value: stats.visitors, color: 'border-t-primary' },
        { label: 'Projects', value: stats.projects, color: 'border-t-blue-500' },
        { label: 'Skills', value: stats.skills, color: 'border-t-yellow-500' },
        { label: 'Experience', value: stats.experience, color: 'border-t-purple-500' },
        { label: 'Education', value: stats.education, color: 'border-t-cyan-500' },
        { label: 'Unread Messages', value: stats.messages, color: 'border-t-green-500' },
    ];

    return (
        <div>
            <h1 className="text-4xl font-heading font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {statCards.map((card, index) => (
                    <div key={index} className={`glass-card p-6 border-t-4 ${card.color} hover:-translate-y-1 hover:shadow-lg hover:shadow-[rgba(139,92,246,0.15)] transition-all duration-300`}>
                        <h3 className="text-gray-400 text-sm font-medium mb-2">{card.label}</h3>
                        <p className="text-4xl font-bold">{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4 text-primary">System Status</h2>
                <div className="flex items-center gap-2 text-green-400">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Backend Connected - API Version 1.0</span>
                </div>
                <p className="text-gray-400 mt-4">Manage your portfolio entities using the sidebar navigation. All changes are reflected in real-time on your public website.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
