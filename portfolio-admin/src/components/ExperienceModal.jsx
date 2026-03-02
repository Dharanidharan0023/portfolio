import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ExperienceModal = ({ isOpen, onClose, onSave, experience }) => {
    const [formData, setFormData] = useState({
        role: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
        isCurrent: false
    });

    useEffect(() => {
        if (experience) {
            setFormData({
                role: experience.role || '',
                company: experience.company || '',
                startDate: experience.startDate ? experience.startDate.split('T')[0] : '',
                endDate: experience.endDate ? experience.endDate.split('T')[0] : '',
                description: experience.description || '',
                isCurrent: experience.isCurrent || false
            });
        } else {
            setFormData({
                role: '',
                company: '',
                startDate: '',
                endDate: '',
                description: '',
                isCurrent: false
            });
        }
    }, [experience, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        // Sanitize payload for C# backend to prevent 400 Bad Request
        const payload = {
            ...formData,
            endDate: formData.isCurrent || !formData.endDate ? null : formData.endDate,
            startDate: formData.startDate ? formData.startDate : new Date().toISOString()
        };

        onSave(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-6">
                    {experience ? 'Edit Experience' : 'Add New Experience'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                            <input
                                type="text"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none disabled:opacity-50"
                                disabled={formData.isCurrent}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isCurrent"
                            checked={formData.isCurrent}
                            onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked, endDate: e.target.checked ? '' : formData.endDate })}
                            className="w-4 h-4 accent-primary"
                        />
                        <label htmlFor="isCurrent" className="text-sm font-medium text-gray-300">Currently Working Here</label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none h-32"
                            placeholder="Describe your responsibilities and achievements..."
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="submit" className="btn-primary flex-grow">
                            {experience ? 'Update Experience' : 'Add Experience'}
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

export default ExperienceModal;
