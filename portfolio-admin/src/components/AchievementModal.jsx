import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AchievementModal = ({ isOpen, onClose, onSave, achievement }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dateAchieved: '',
        issuer: '',
        badgeUrl: '',
        url: '',
        orderIndex: 0,
        isPublished: true
    });

    useEffect(() => {
        if (achievement) {
            setFormData({
                title: achievement.title || '',
                description: achievement.description || '',
                dateAchieved: achievement.dateAchieved ? achievement.dateAchieved.split('T')[0] : '',
                issuer: achievement.issuer || '',
                badgeUrl: achievement.badgeUrl || '',
                url: achievement.url || '',
                orderIndex: achievement.orderIndex || 0,
                isPublished: achievement.isPublished ?? true
            });
        } else {
            setFormData({
                title: '',
                description: '',
                dateAchieved: '',
                issuer: '',
                badgeUrl: '',
                url: '',
                orderIndex: 0,
                isPublished: true
            });
        }
    }, [achievement, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            id: achievement?.id,
            dateAchieved: formData.dateAchieved ? new Date(formData.dateAchieved).toISOString() : new Date().toISOString()
        };
        onSave(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-white text-center">
                    {achievement ? 'Edit Achievement' : 'Add New Achievement'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-white"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Issuer</label>
                            <input
                                type="text"
                                value={formData.issuer}
                                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-white"
                                placeholder="e.g., Google, SIH"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Date Achieved</label>
                            <input
                                type="date"
                                value={formData.dateAchieved}
                                onChange={(e) => setFormData({ ...formData, dateAchieved: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-white"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Badge/Image URL</label>
                            <input
                                type="url"
                                value={formData.badgeUrl}
                                onChange={(e) => setFormData({ ...formData, badgeUrl: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Certificate URL</label>
                            <input
                                type="url"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-white"
                                placeholder="Link to PDF or credential"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none h-32 text-white"
                            placeholder="Describe your achievement points..."
                            required
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Order Index</label>
                            <input
                                type="number"
                                value={formData.orderIndex}
                                onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-white"
                            />
                        </div>
                        <div className="flex items-center gap-2 mt-6">
                            <input
                                type="checkbox"
                                id="isPublished"
                                checked={formData.isPublished}
                                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                className="w-4 h-4 accent-primary"
                            />
                            <label htmlFor="isPublished" className="text-sm font-medium text-gray-300">Published</label>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="submit" className="btn-primary flex-grow">
                            {achievement ? 'Update Achievement' : 'Add Achievement'}
                        </button>
                        <button type="button" onClick={onClose} className="px-6 py-2 border border-white/10 rounded-full hover:bg-white/5 transition-colors text-white">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AchievementModal;
