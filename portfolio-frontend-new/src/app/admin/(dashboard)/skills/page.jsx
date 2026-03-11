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

    // Group skills by category
    const categories = ['Frontend', 'Backend', 'Database', 'Tools', 'Other'];

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
                        if (categorySkills.length === 0) return null;

                        return (
                            <div key={category} className="glass-card p-6">
                                <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">{category}</h2>
                                <div className="space-y-4">
                                    {categorySkills.map(skill => (
                                        <div key={skill.id} className="flex items-center justify-between group">
                                            <div className="flex-grow mr-4">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-gray-200 font-medium">{skill.name}</span>
                                                    <span className="text-xs text-primary">{skill.proficiencyPercentage}%</span>
                                                </div>
                                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${skill.proficiencyPercentage}%` }}></div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                <button onClick={() => handleEdit(skill)} className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded">
                                                    <Edit size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(skill.id)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
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
