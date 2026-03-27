"use client";

import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit, MoreVertical, Eye, EyeOff } from 'lucide-react';
import api from "@/lib/api";
import ProjectModal from "@/components/admin/ProjectModal";

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (err) {
            console.error('Failed to fetch projects', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData) => {
        try {
            if (selectedProject) {
                // Update
                const res = await api.put(`/projects/${selectedProject.id}`, {
                    ...formData,
                    id: selectedProject.id
                });
                setProjects(projects.map(p => p.id === selectedProject.id ? res.data || { ...formData, id: selectedProject.id } : p));
                // Reload to be sure data is synced with DB defaults
                fetchProjects();
            } else {
                // Create
                const res = await api.post('/projects', formData);
                setProjects([...projects, res.data]);
            }
            setIsModalOpen(false);
            setSelectedProject(null);
        } catch (err) {
            console.error('Failed to save project', err);
            const errorMsg = err.response?.data?.message || err.response?.data?.title || err.message;
            const details = err.response?.data?.details || '';
            alert(`Failed to save project: ${errorMsg}\n${details}`);
        }
    };

    const handleEdit = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleToggleVisibility = async (id) => {
        try {
            const res = await api.patch(`/projects/${id}/toggle-visibility`);
            setProjects(projects.map(p => p.id === id ? { ...p, isVisible: res.data.isVisible } : p));
        } catch (err) {
            console.error('Failed to toggle visibility', err);
            alert('Failed to update visibility');
        }
    };

    const handleOrderChange = async (id, newOrder) => {
        try {
            await api.patch(`/projects/${id}/order`, newOrder, {
                headers: { 'Content-Type': 'application/json' }
            });
            setProjects(projects.map(p => p.id === id ? { ...p, order: newOrder } : p));
        } catch (err) {
            console.error('Failed to update order', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                console.log(`Attempting to delete project with ID: ${id}`);
                const res = await api.delete(`/projects/${id}`);
                console.log('Delete response:', res.status);
                setProjects(projects.filter(p => p.id !== id));
            } catch (err) {
                console.error('Project deletion failed:', {
                    id,
                    status: err.response?.status,
                    data: err.response?.data,
                    message: err.message
                });
                const errorMsg = err.response?.data?.message || err.response?.data?.title || 'Check console for details';
                alert(`Failed to delete project: ${errorMsg}`);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Projects</h1>
                <button
                    onClick={() => { setSelectedProject(null); setIsModalOpen(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} /> Add Project
                </button>
            </div>

            <div className="glass-card !overflow-visible rounded-xl border border-white/10 mb-20" style={{ minHeight: '500px' }}>
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading projects...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="p-4 font-semibold text-gray-300 rounded-tl-xl">Title</th>
                                <th className="p-4 font-semibold text-gray-300">Tech Stack</th>
                                <th className="p-4 font-semibold text-gray-300">Featured</th>
                                <th className="p-4 font-semibold text-gray-300 text-right rounded-tr-xl">Actions</th>
                            </tr>
                        </thead>
                        <tbody ref={dropdownRef}>
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-400">No projects found.</td>
                                </tr>
                            ) : (
                                [...projects].sort((a, b) => a.order - b.order).map((project, index) => (
                                    <tr key={project.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">{project.title}</td>
                                        <td className="p-4 text-sm text-gray-400">{project.techStack}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs ${project.isFeatured ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-gray-500/20 text-gray-400 border border-white/5'}`}>
                                                {project.isFeatured ? 'Featured' : 'Standard'}
                                            </span>
                                        </td>
                                        <td className="p-4 relative">
                                            <div className="flex justify-end relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenDropdownId(openDropdownId === project.id ? null : project.id);
                                                    }}
                                                    className="p-2 bg-gray-500/10 text-gray-300 hover:bg-gray-500/20 hover:text-white rounded transition-colors"
                                                >
                                                    <MoreVertical size={16} />
                                                </button>
 
                                                {openDropdownId === project.id && (
                                                    <div className={`absolute right-0 ${index >= projects.length - 3 && projects.length > 3 ? 'bottom-full mb-2' : 'top-full mt-2'} w-56 bg-gray-900 border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden shadow-black/80`}>
                                                        <div className="p-2 border-b border-white/5">
                                                            <div className="text-xs text-gray-400 mb-2 px-2">Order / Priority</div>
                                                            <div className="flex items-center gap-2 px-2">
                                                                <input 
                                                                    type="number" 
                                                                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm outline-none focus:border-primary"
                                                                    value={project.order}
                                                                    onChange={(e) => handleOrderChange(project.id, parseInt(e.target.value) || 0)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="p-1">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleToggleVisibility(project.id);
                                                                }}
                                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded transition-colors"
                                                            >
                                                                {project.isVisible ? <EyeOff size={16} className="text-orange-400" /> : <Eye size={16} className="text-green-400" />}
                                                                {project.isVisible ? 'Hide Project' : 'Show Project'}
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEdit(project);
                                                                    setOpenDropdownId(null);
                                                                }}
                                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                                                            >
                                                                <Edit size={16} /> Edit Details
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(project.id);
                                                                    setOpenDropdownId(null);
                                                                }}
                                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                                            >
                                                                <Trash2 size={16} /> Delete Project
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                project={selectedProject}
            />
        </div>
    );
};

export default ManageProjects;
