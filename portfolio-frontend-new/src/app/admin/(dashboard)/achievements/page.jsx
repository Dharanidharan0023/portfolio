"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Award, GraduationCap, Loader2 } from 'lucide-react';
import api from "@/lib/api";
import AchievementModal from "@/components/admin/AchievementModal";
import EducationModal from "@/components/admin/EducationModal";

const ManageCredentials = () => {
    // Education State
    const [educations, setEducations] = useState([]);
    const [isEduModalOpen, setIsEduModalOpen] = useState(false);
    const [selectedEdu, setSelectedEdu] = useState(null);

    // Achievement State
    const [achievements, setAchievements] = useState([]);
    const [isAchModalOpen, setIsAchModalOpen] = useState(false);
    const [selectedAch, setSelectedAch] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [eduRes, achRes] = await Promise.all([
                api.get('/educations'),
                api.get('/achievements')
            ]);
            setEducations(eduRes.data);
            setAchievements(achRes.data);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

    // --- EDUCATION HANDLERS ---
    const handleSaveEdu = async (formData) => {
        try {
            if (selectedEdu) {
                await api.put(`/educations/${selectedEdu.id}`, { ...formData, id: selectedEdu.id });
            } else {
                await api.post('/educations', formData);
            }
            const res = await api.get('/educations');
            setEducations(res.data);
            setIsEduModalOpen(false);
            setSelectedEdu(null);
        } catch (err) {
            console.error('Failed to save education', err);
        }
    };

    const handleDeleteEdu = async (id) => {
        if (!window.confirm('Delete this education record?')) return;
        try {
            await api.delete(`/educations/${id}`);
            setEducations(educations.filter(e => e.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    // --- ACHIEVEMENT HANDLERS ---
    const handleSaveAch = async (formData) => {
        try {
            if (selectedAch) {
                await api.put(`/achievements/${selectedAch.id}`, { ...formData, id: selectedAch.id });
            } else {
                await api.post('/achievements', formData);
            }
            const res = await api.get('/achievements');
            setAchievements(res.data);
            setIsAchModalOpen(false);
            setSelectedAch(null);
        } catch (err) {
            console.error('Failed to save achievement', err);
        }
    };

    const handleDeleteAch = async (id) => {
        if (!window.confirm('Delete this achievement?')) return;
        try {
            await api.delete(`/achievements/${id}`);
            setAchievements(achievements.filter(a => a.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Loading credentials...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            {/* EDUCATION SECTION */}
            <section>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <GraduationCap className="text-primary" /> Education & Background
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage your academic history and degrees.</p>
                    </div>
                    <button
                        onClick={() => { setSelectedEdu(null); setIsEduModalOpen(true); }}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={20} /> Add Education
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {educations.length === 0 ? (
                        <div className="text-center p-12 glass-card border-dashed border-2 border-border/50 text-muted-foreground">
                            No education records found.
                        </div>
                    ) : (
                        [...educations].sort((a, b) => new Date(b.startDate) - new Date(a.startDate)).map((edu, index) => (
                            <div key={edu.id} className="glass-card p-6 flex justify-between items-start group hover:border-primary/30 transition-all relative">
                                <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold font-mono text-sm shadow-lg backdrop-blur-md">
                                    {index + 1}
                                </div>
                                <div className="pl-2">
                                    <h3 className="text-xl font-bold text-foreground mb-1">{edu.degree}</h3>
                                    <p className="text-primary font-semibold text-lg">{edu.institution}</p>
                                    <p className="text-sm text-muted-foreground mt-1 bg-secondary/50 inline-block px-2 py-0.5 rounded">
                                        {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}
                                    </p>
                                    <p className="text-muted-foreground mt-4 line-clamp-2">{edu.description}</p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setSelectedEdu(edu); setIsEduModalOpen(true); }} className="p-2.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteEdu(edu.id)} className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <hr className="border-border/50" />

            {/* ACHIEVEMENTS SECTION */}
            <section>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Award className="text-primary" /> Achievements & Certs
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage your awards, certifications, and milestones.</p>
                    </div>
                    <button
                        onClick={() => { setSelectedAch(null); setIsAchModalOpen(true); }}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={20} /> Add Achievement
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.length === 0 ? (
                        <div className="text-center p-12 glass-card border-dashed border-2 border-border/50 text-muted-foreground col-span-full">
                            No achievements found.
                        </div>
                    ) : (
                        [...achievements]
                            .sort((a, b) => {
                                if (a.order !== b.order) return a.order - b.order;
                                return new Date(b.dateAchieved) - new Date(a.dateAchieved);
                            })
                            .map((ach, index) => (
                            <div key={ach.id} className="glass-card flex flex-col group overflow-hidden hover:border-primary/30 transition-all relative">
                                <div className="absolute left-3 top-3 w-7 h-7 rounded-sm bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold font-mono text-xs shadow-lg backdrop-blur-md">
                                    #{index + 1}
                                </div>
                                <div className="p-6 pt-12 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{ach.title}</h3>
                                    <p className="text-sm text-primary mb-3">
                                        {new Date(ach.dateAchieved).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                                    </p>
                                    <p className="text-muted-foreground flex-grow text-sm leading-relaxed">{ach.description}</p>

                                    <div className="flex gap-2 justify-end mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setSelectedAch(ach); setIsAchModalOpen(true); }} className="p-2.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => handleDeleteAch(ach.id)} className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <EducationModal
                isOpen={isEduModalOpen}
                onClose={() => setIsEduModalOpen(false)}
                onSave={handleSaveEdu}
                education={selectedEdu}
            />

            <AchievementModal
                isOpen={isAchModalOpen}
                onClose={() => setIsAchModalOpen(false)}
                onSave={handleSaveAch}
                achievement={selectedAch}
            />
        </div>
    );
};

export default ManageCredentials;
