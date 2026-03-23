"use client";
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ProjectModal = ({ isOpen, onClose, onSave, project }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        githubUrl: '',
        projectUrl: '',
        techStack: '',
        isFeatured: false,
        isVisible: true,
        order: 0
    });

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title || '',
                description: project.description || '',
                imageUrl: project.imageUrl || '',
                githubUrl: project.githubUrl || '',
                projectUrl: project.projectUrl || '',
                techStack: project.techStack || '',
                isFeatured: project.isFeatured || false,
                isVisible: project.isVisible !== undefined ? project.isVisible : true,
                order: project.order || 0
            });
        } else {
            setFormData({
                title: '',
                description: '',
                imageUrl: '',
                githubUrl: '',
                projectUrl: '',
                techStack: '',
                isFeatured: false,
                isVisible: true,
                order: 0
            });
        }
    }, [project, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-6">
                    {project ? 'Edit Project' : 'Add New Project'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none h-24"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                            <input
                                type="text"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Tech Stack (comma separated)</label>
                            <input
                                type="text"
                                value={formData.techStack}
                                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
                                placeholder="React, Node.js, etc."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">GitHub URL</label>
                            <input
                                type="text"
                                value={formData.githubUrl}
                                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Project URL (Live Demo)</label>
                            <input
                                type="text"
                                value={formData.projectUrl}
                                onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isFeatured"
                                checked={formData.isFeatured}
                                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                className="w-4 h-4 accent-primary"
                            />
                            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-300">Featured Project</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isVisible"
                                checked={formData.isVisible}
                                onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                                className="w-4 h-4 accent-primary"
                            />
                            <label htmlFor="isVisible" className="text-sm font-medium text-gray-300">Visible on Site</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <label htmlFor="order" className="text-sm font-medium text-gray-300">Order:</label>
                            <input
                                type="number"
                                id="order"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="submit" className="btn-primary flex-grow">
                            {project ? 'Update Project' : 'Create Project'}
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

export default ProjectModal;
