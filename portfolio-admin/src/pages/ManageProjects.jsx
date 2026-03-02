import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import api from '../utils/axios';
import ProjectModal from '../components/ProjectModal';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await api.delete(`/projects/${id}`);
                setProjects(projects.filter(p => p.id !== id));
            } catch (err) {
                console.error('Failed to delete', err);
                alert('Failed to delete project');
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

            <div className="glass-card overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading projects...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="p-4 font-semibold text-gray-300">Title</th>
                                <th className="p-4 font-semibold text-gray-300">Tech Stack</th>
                                <th className="p-4 font-semibold text-gray-300">Featured</th>
                                <th className="p-4 font-semibold text-gray-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-400">No projects found.</td>
                                </tr>
                            ) : (
                                projects.map(project => (
                                    <tr key={project.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">{project.title}</td>
                                        <td className="p-4 text-sm text-gray-400">{project.techStack}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs ${project.isFeatured ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                {project.isFeatured ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td className="p-4 flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(project)}
                                                className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
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
