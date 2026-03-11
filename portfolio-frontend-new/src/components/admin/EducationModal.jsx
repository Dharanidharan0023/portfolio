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
        orderIndex: 0
    });

    useEffect(() => {
        if (education) {
            setFormData({
                institution: education.institution || '',
                degree: education.degree || '',
                startDate: education.startDate ? education.startDate.split('T')[0] : '',
                endDate: education.endDate ? education.endDate.split('T')[0] : '',
                description: education.description || '',
                orderIndex: education.orderIndex || 0
            });
        } else {
            setFormData({
                institution: '',
                degree: '',
                startDate: '',
                endDate: '',
                description: '',
                orderIndex: 0
            });
        }
    }, [education, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-surface-dark border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-2xl font-bold">{education ? 'Edit Education' : 'Add Education'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm text-gray-400">Institution</label>
                            <input
                                required
                                type="text"
                                value={formData.institution}
                                onChange={e => setFormData({ ...formData, institution: e.target.value })}
                                className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 focus:border-primary outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-gray-400">Degree / Certificate</label>
                            <input
                                required
                                type="text"
                                value={formData.degree}
                                onChange={e => setFormData({ ...formData, degree: e.target.value })}
                                className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 focus:border-primary outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-gray-400">Start Date</label>
                            <input
                                required
                                type="date"
                                value={formData.startDate}
                                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 focus:border-primary outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-gray-400">End Date</label>
                            <input
                                required
                                type="date"
                                value={formData.endDate}
                                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 focus:border-primary outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm text-gray-400">Description</label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 focus:border-primary outline-none resize-none"
                        />
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
