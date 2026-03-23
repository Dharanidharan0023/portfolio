"use client";
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EducationModal = ({ isOpen, onClose, onSave, education }) => {
    const [formData, setFormData] = useState({
        institution: '',
        degree: '',
        startDate: '',
        endDate: '',
        description: '',
        order: 0,
        isVisible: true
    });

    useEffect(() => {
        if (education) {
            setFormData({
                institution: education.institution || '',
                degree: education.degree || '',
                startDate: education.startDate ? education.startDate.split('T')[0] : '',
                endDate: education.endDate ? education.endDate.split('T')[0] : '',
                description: education.description || '',
                order: education.order || 0,
                isVisible: education.isVisible ?? true
            });
        } else {
            setFormData({
                institution: '',
                degree: '',
                startDate: '',
                endDate: '',
                description: '',
                order: 0,
                isVisible: true
            });
        }
    }, [education, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
            endDate: formData.endDate ? new Date(formData.endDate).toISOString() : new Date().toISOString()
        };
        onSave(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-surface-dark border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl p-8 relative glass-card">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-6">{education ? 'Edit Education' : 'Add Education'}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm text-gray-400">Institution</label>
                            <input
                                required
                                type="text"
                                value={formData.institution}
                                onChange={e => setFormData({ ...formData, institution: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-gray-400">Degree / Certificate</label>
                            <input
                                required
                                type="text"
                                value={formData.degree}
                                onChange={e => setFormData({ ...formData, degree: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-gray-400">Start Date</label>
                            <input
                                required
                                type="date"
                                value={formData.startDate}
                                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-gray-400">End Date</label>
                            <input
                                required
                                type="date"
                                value={formData.endDate}
                                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="text-sm text-gray-400">Order</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 mt-6">
                            <input
                                type="checkbox"
                                id="isVisible"
                                checked={formData.isVisible}
                                onChange={e => setFormData({ ...formData, isVisible: e.target.checked })}
                                className="w-4 h-4 accent-primary"
                            />
                            <label htmlFor="isVisible" className="text-sm text-gray-400">Is Visible</label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg hover:bg-white/5 transition-colors">Cancel</button>
                        <button type="submit" className="btn-primary px-8 py-2">Save Education</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EducationModal;
