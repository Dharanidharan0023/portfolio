"use client";
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const SkillModal = ({ isOpen, onClose, onSave, skill }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Frontend',
        proficiencyPercentage: 80,
        icon: ''
    });

    useEffect(() => {
        if (skill) {
            setFormData({
                name: skill.name || '',
                category: skill.category || 'Frontend',
                proficiencyPercentage: skill.proficiencyPercentage || 80,
                icon: skill.icon || ''
            });
        } else {
            setFormData({
                name: '',
                category: 'Frontend',
                proficiencyPercentage: 80,
                icon: ''
            });
        }
    }, [skill, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="glass-card w-full max-w-md p-8 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-6">
                    {skill ? 'Edit Skill' : 'Add New Skill'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Skill Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
                        >
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Database">Database</option>
                            <option value="Tools">Tools</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-300">Proficiency (%)</label>
                            <span className="text-primary text-sm font-bold">{formData.proficiencyPercentage}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={formData.proficiencyPercentage}
                            onChange={(e) => setFormData({ ...formData, proficiencyPercentage: parseInt(e.target.value) })}
                            className="w-full accent-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Icon (Lucide name or URL)</label>
                        <input
                            type="text"
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
                            placeholder="Code, Database, etc."
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="submit" className="btn-primary flex-grow">
                            {skill ? 'Update Skill' : 'Add Skill'}
                        </button>
                        <button type="button" onClick={onClose} className="px-6 py-2 border border-white/10 rounded-full hover:bg-white/5 transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SkillModal;
