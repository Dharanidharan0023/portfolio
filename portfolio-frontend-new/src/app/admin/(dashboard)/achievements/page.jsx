"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Award } from 'lucide-react';
import api from "@/lib/api";
import AchievementModal from "@/components/admin/AchievementModal";

const ManageAchievements = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAch, setSelectedAch] = useState(null);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const res = await api.get('/achievements');
            setAchievements(res.data);
        } catch (err) {
            console.error('Failed to fetch achievements', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData) => {
        try {
            if (selectedAch) {
                await api.put(`/achievements/${selectedAch.id}`, { ...formData, id: selectedAch.id });
                fetchAchievements();
            } else {
                await api.post('/achievements', formData);
                fetchAchievements();
            }
            setIsModalOpen(false);
            setSelectedAch(null);
        } catch (err) {
            console.error('Failed to save achievement', err);
            alert('Failed to save achievement');
        }
    };

    const handleEdit = (ach) => {
        setSelectedAch(ach);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this achievement?')) {
            try {
                await api.delete(`/achievements/${id}`);
                setAchievements(achievements.filter(a => a.id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Award className="text-primary" /> Manage Achievements
                </h1>
                <button
                    onClick={() => { setSelectedAch(null); setIsModalOpen(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} /> Add Achievement
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="text-center p-10 text-gray-400 col-span-full">Loading achievements...</div>
                ) : achievements.length === 0 ? (
                    <div className="text-center p-10 glass-card text-gray-400 col-span-full">No achievements found.</div>
                ) : (
                    achievements.map(ach => (
                        <div key={ach.id} className="glass-card flex flex-col group overflow-hidden">
                            {ach.imageUrl && (
                                <div className="h-40 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img src={ach.imageUrl} alt={ach.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                            )}
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-white mb-2">{ach.title}</h3>
                                <p className="text-sm text-primary mb-3">
                                    {new Date(ach.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                                <p className="text-gray-300 flex-grow text-sm">{ach.description}</p>

                                <div className="flex gap-2 justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(ach)} className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded transition-colors">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(ach.id)} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <AchievementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                achievement={selectedAch}
            />
        </div>
    );
};

export default ManageAchievements;
