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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
            <div className="glass-card w-full max-w-2xl max-h-[95vh] md:max-h-[90vh] flex flex-col border border-white/10 shadow-2xl overflow-hidden">
                {/* Sticky Header */}
                <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-lg shrink-0">
                    <h2 className="text-xl sm:text-2xl font-bold">
                        {project ? 'Edit Project' : 'Add New Project'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <form id="project-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 custom-scrollbar">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5 px-1">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="Enter project title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5 px-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none h-32 resize-none transition-all"
                                placeholder="Describe your project..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5 px-1">Image URL</label>
                                <input
                                    type="text"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5 px-1">Tech Stack</label>
                                <input
                                    type="text"
                                    value={formData.techStack}
                                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                                    placeholder="e.g. React, Node.js"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5 px-1">GitHub URL</label>
                                <input
                                    type="text"
                                    value={formData.githubUrl}
                                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5 px-1">Live Demo URL</label>
                                <input
                                    type="text"
                                    value={formData.projectUrl}
                                    onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6 sm:gap-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="w-5 h-5 accent-primary rounded cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Featured Project</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={formData.isVisible}
                                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                                    className="w-5 h-5 accent-primary rounded cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Visible on Site</span>
                            </label>
                            <div className="flex items-center gap-3 sm:ml-auto w-full sm:w-auto mt-2 sm:mt-0">
                                <span className="text-sm font-medium text-gray-400">Display Order:</span>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    className="w-20 bg-white/10 border border-white/10 rounded-lg px-3 py-1 text-center outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>
                </form>

                {/* Sticky Footer */}
                <div className="p-4 sm:p-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 bg-white/5 backdrop-blur-lg shrink-0">
                    <button 
                        type="submit"
                        form="project-form"
                        className="btn-primary w-full sm:flex-grow py-3 text-lg font-bold shadow-lg shadow-primary/20"
                    >
                        {project ? 'Update Project' : 'Create Project'}
                    </button>
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="w-full sm:w-auto px-8 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all font-medium text-foreground"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
