"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Cpu } from 'lucide-react';
import api from "@/lib/api";
import SkillModal from "@/components/admin/SkillModal";

const ManageSkills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(null);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const res = await api.get('/skills');
            setSkills(res.data);
        } catch (err) {
            console.error('Failed to fetch skills', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData) => {
        try {
            if (selectedSkill) {
                await api.put(`/skills/${selectedSkill.id}`, { ...formData, id: selectedSkill.id });
                fetchSkills();
            } else {
                await api.post('/skills', formData);
                fetchSkills();
            }
            setIsModalOpen(false);
            setSelectedSkill(null);
        } catch (err) {
            console.error('Failed to save skill', err);
            alert('Failed to save skill');
        }
    };

    const handleEdit = (skill) => {
        setSelectedSkill(skill);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/skills/${id}`);
                setSkills(skills.filter(s => s.id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    // Group skills by category with explicit required categories
    const defaultCategories = ['Languages', 'Frontend', 'Backend', 'Database', 'Tools', 'Admin Control'];
    const dynamicCategories = Array.from(new Set(skills.map(s => s.category).filter(Boolean)));
    const categories = Array.from(new Set([...defaultCategories, ...dynamicCategories]));

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Cpu className="text-primary" /> Manage Skills
                </h1>
                <button
                    onClick={() => { setSelectedSkill(null); setIsModalOpen(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} /> Add Skill
                </button>
            </div>

            {loading ? (
                <div className="text-center p-10 text-gray-400">Loading skills...</div>
            ) : skills.length === 0 ? (
                <div className="text-center p-10 glass-card text-gray-400">No skills found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {categories.map(category => {
                        const categorySkills = skills.filter(s => s.category === category);
                        // Only hide dynamic categories if empty, but always show default ones
                        if (categorySkills.length === 0 && !defaultCategories.includes(category)) return null;

                        return (
                            <div key={category} className="glass-card p-6">
                                <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">{category}</h2>
                                <div className="grid grid-cols-1 gap-3">
                                    {categorySkills.length > 0 ? (
                                        categorySkills.map(skill => (
                                            <div key={skill.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                        <Cpu size={20} />
                                                    </div>
                                                    <span className="text-gray-200 font-medium">{skill.name}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEdit(skill)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(skill.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 border border-dashed border-white/10 rounded-xl">
                                            <p className="text-gray-500 text-sm mb-2">No skills in this category</p>
                                            <button 
                                                onClick={() => { setSelectedSkill(null); setIsModalOpen(true); }}
                                                className="text-primary text-xs hover:underline flex items-center gap-1 mx-auto"
                                            >
                                                <Plus size={12} /> Add Skill
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <SkillModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                skill={selectedSkill}
            />
        </div>
    );
};

export default ManageSkills;
