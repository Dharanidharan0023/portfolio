"use client";
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const SkillModal = ({ isOpen, onClose, onSave, skill }) => {
    const [existingCategories, setExistingCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        proficiencyLevel: 80,
        iconUrl: '',
        order: 0,
        isVisible: true
    });

    useEffect(() => {
        const fetchCategories = async () => {
             try {
                 const res = await import('@/lib/api').then(m => m.default.get('/skills'));
                 const cats = Array.from(new Set(res.data.map(s => s.category).filter(Boolean)));
                 setExistingCategories(cats.length > 0 ? cats : ['Languages', 'Frontend', 'Backend', 'Database', 'Tools', 'Admin Control', 'Other']);
             } catch (e) {
                 setExistingCategories(['Languages', 'Frontend', 'Backend', 'Database', 'Tools', 'Admin Control', 'Other']);
             }
        };
        if (isOpen) {
             fetchCategories();
        }
    }, [isOpen]);

    useEffect(() => {
        if (skill) {
            setFormData({
                name: skill.name || '',
                category: skill.category || '',
                proficiencyLevel: skill.proficiencyLevel || 80,
                iconUrl: skill.iconUrl || '',
                order: skill.order || 0,
                isVisible: skill.isVisible ?? true
            });
        } else {
            setFormData({
                name: '',
                category: '',
                proficiencyLevel: 80,
                iconUrl: '',
                order: 0,
                isVisible: true
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
                        <input
                            type="text"
                            list="category-suggestions"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
                            placeholder="Select or type a new category"
                            required
                        />
                        <datalist id="category-suggestions">
                            {existingCategories.map((cat, idx) => (
                                <option key={idx} value={cat} />
                            ))}
                        </datalist>
                    </div>

                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-300">Proficiency (%)</label>
                            <span className="text-primary text-sm font-bold">{formData.proficiencyLevel}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={formData.proficiencyLevel}
                            onChange={(e) => setFormData({ ...formData, proficiencyLevel: parseInt(e.target.value) })}
                            className="w-full accent-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Order</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 mt-6">
                            <input
                                type="checkbox"
                                id="isVisible"
                                checked={formData.isVisible}
                                onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                                className="w-4 h-4 accent-primary"
                            />
                            <label htmlFor="isVisible" className="text-sm font-medium text-gray-300">Is Visible</label>
                        </div>
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
