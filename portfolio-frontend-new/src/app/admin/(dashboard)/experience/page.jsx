"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Briefcase, Loader2 } from 'lucide-react';
import api from "@/lib/api";
import ExperienceModal from "@/components/admin/ExperienceModal";

const ManageWorkExperience = () => {
    // Experience State
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isExpModalOpen, setIsExpModalOpen] = useState(false);
    const [selectedExp, setSelectedExp] = useState(null);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        setLoading(true);
        try {
            const res = await api.get('/experiences');
            setExperiences(res.data);
        } catch (err) {
            console.error('Failed to fetch experiences', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveExp = async (formData) => {
        try {
            if (selectedExp) {
                await api.put(`/experiences/${selectedExp.id}`, { ...formData, id: selectedExp.id });
            } else {
                await api.post('/experiences', formData);
            }
            fetchExperiences();
            setIsExpModalOpen(false);
            setSelectedExp(null);
        } catch (err) {
            console.error('Failed to save experience', err);
            alert('Error saving experience');
        }
    };

    const handleDeleteExp = async (id) => {
        if (!window.confirm('Delete this experience?')) return;
        try {
            await api.delete(`/experiences/${id}`);
            setExperiences(experiences.filter(e => e.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Loading work history...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            <section>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Briefcase className="text-primary" /> Work Experience
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage your employment history and internships.</p>
                    </div>
                    <button
                        onClick={() => { setSelectedExp(null); setIsExpModalOpen(true); }}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={20} /> Add Experience
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {experiences.length === 0 ? (
                        <div className="text-center p-12 glass-card border-dashed border-2 border-border/50 text-muted-foreground">
                            No experience records found.
                        </div>
                    ) : (
                        experiences.map(exp => (
                            <div key={exp.id} className="glass-card p-6 flex justify-between items-start group hover:border-primary/30 transition-all">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold text-foreground">{exp.role}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${exp.isVisible ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {exp.isVisible ? 'Public' : 'Hidden'}
                                        </span>
                                    </div>
                                    <p className="text-primary font-semibold text-lg">{exp.company}</p>
                                    <p className="text-sm text-muted-foreground mt-1 bg-secondary/50 inline-block px-2 py-0.5 rounded">
                                        {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} - {exp.isCurrent ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Present')}
                                    </p>
                                    <p className="text-muted-foreground mt-4 line-clamp-2 max-w-2xl">{exp.description}</p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setSelectedExp(exp); setIsExpModalOpen(true); }} className="p-2.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteExp(exp.id)} className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <ExperienceModal
                isOpen={isExpModalOpen}
                onClose={() => setIsExpModalOpen(false)}
                onSave={handleSaveExp}
                experience={selectedExp}
            />
        </div>
    );
};

export default ManageWorkExperience;
