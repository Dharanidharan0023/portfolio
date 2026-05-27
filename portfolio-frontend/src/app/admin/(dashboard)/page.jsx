"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";

import { Users, Briefcase, Code, GraduationCap, Trophy, MessageSquare, PlusCircle } from 'lucide-react';

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
                    api.get('/visitors/stats').catch(() => ({ data: { TotalVisitors: 0 } })),
                    api.get('/projects').catch(() => ({ data: [] })),
                    api.get('/messages').catch(() => ({ data: [] })),
                    api.get('/experiences').catch(() => ({ data: [] })),
                    api.get('/educations').catch(() => ({ data: [] })),
                    api.get('/skills').catch(() => ({ data: [] }))
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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );

    const statCards = [
        { label: 'Total Views', value: stats.visitors, color: 'text-blue-400', icon: Users, bg: 'bg-blue-400/10' },
        { label: 'Projects', value: stats.projects, color: 'text-indigo-400', icon: Briefcase, bg: 'bg-indigo-400/10' },
        { label: 'Skills', value: stats.skills, color: 'text-amber-400', icon: Code, bg: 'bg-amber-400/10' },
        { label: 'Experience', value: stats.experience, color: 'text-purple-400', icon: Trophy, bg: 'bg-purple-400/10' },
        { label: 'Education', value: stats.education, color: 'text-cyan-400', icon: GraduationCap, bg: 'bg-cyan-400/10' },
        { label: 'Unread Messages', value: stats.messages, color: 'text-emerald-400', icon: MessageSquare, bg: 'bg-emerald-400/10' },
    ];

    return (
        <div className="space-y-10 max-w-7xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight text-white">Dashboard Overview</h1>
                <p className="text-gray-400">Welcome back. Here's what's happening with your portfolio today.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((card, index) => (
                    <div key={index} className="glass-card group p-6 hover:border-primary/30 transition-all duration-300">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-400 mb-1">{card.label}</p>
                                <p className="text-3xl font-bold text-white">{card.value}</p>
                            </div>
                            <div className={`p-3 rounded-2xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                                <card.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <PlusCircle className="text-primary" />
                        <h2 className="text-xl font-bold text-white">Quick Actions</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <a href="/admin/projects" className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-center">
                            <span className="text-sm font-medium text-white">Add Project</span>
                        </a>
                        <a href="/admin/skills" className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-center">
                            <span className="text-sm font-medium text-white">Add Skill</span>
                        </a>
                        <a href="/admin/experience" className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-center">
                            <span className="text-sm font-medium text-white">Add Experience</span>
                        </a>
                        <a href="/admin/contacts" className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-center">
                            <span className="text-sm font-medium text-white">View Messages</span>
                        </a>
                    </div>
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
    </div>
    );
};

export default AdminDashboard;
