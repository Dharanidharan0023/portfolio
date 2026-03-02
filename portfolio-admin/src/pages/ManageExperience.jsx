import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Briefcase } from 'lucide-react';
import api from '../utils/axios';
import ExperienceModal from '../components/ExperienceModal';

const ManageExperience = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExp, setSelectedExp] = useState(null);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const res = await api.get('/experiences');
            setExperiences(res.data);
        } catch (err) {
            console.error('Failed to fetch experiences', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData) => {
        try {
            if (selectedExp) {
                await api.put(`/experiences/${selectedExp.id}`, { ...formData, id: selectedExp.id });
                fetchExperiences();
            } else {
                await api.post('/experiences', formData);
                fetchExperiences();
            }
            setIsModalOpen(false);
            setSelectedExp(null);
        } catch (err) {
            console.error('Failed to save experience', err);
            alert('Failed to save experience');
        }
    };

    const handleEdit = (exp) => {
        setSelectedExp(exp);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/experiences/${id}`);
                setExperiences(experiences.filter(e => e.id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Briefcase className="text-primary" /> Manage Experience
                </h1>
                <button
                    onClick={() => { setSelectedExp(null); setIsModalOpen(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} /> Add Experience
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="text-center p-10 text-gray-400">Loading experiences...</div>
                ) : experiences.length === 0 ? (
                    <div className="text-center p-10 glass-card text-gray-400">No experience records found.</div>
                ) : (
                    experiences.map(exp => (
                        <div key={exp.id} className="glass-card p-6 flex justify-between items-start group">
                            <div>
                                <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                                <p className="text-primary font-medium">{exp.company}</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                                </p>
                                <p className="text-gray-300 mt-4 line-clamp-2">{exp.description}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(exp)} className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded transition-colors">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(exp.id)} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ExperienceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                experience={selectedExp}
            />
        </div>
    );
};

export default ManageExperience;
