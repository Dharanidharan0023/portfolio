"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, GraduationCap, Loader2 } from 'lucide-react';
import api from "@/lib/api";
import EducationModal from "@/components/admin/EducationModal";

const ManageEducation = () => {
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEdu, setSelectedEdu] = useState(null);

    useEffect(() => {
        fetchEducations();
    }, []);

    const fetchEducations = async () => {
        try {
            const res = await api.get('/educations');
            setEducations(res.data);
        } catch (err) {
            console.error('Failed to fetch educations', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData) => {
        try {
            if (selectedEdu) {
                await api.put(`/educations/${selectedEdu.id}`, { ...formData, id: selectedEdu.id });
            } else {
                await api.post('/educations', formData);
            }
            fetchEducations();
            setIsModalOpen(false);
            setSelectedEdu(null);
        } catch (err) {
            console.error('Failed to save education', err);
            alert('Failed to save education');
        }
    };

    const handleEdit = (edu) => {
        setSelectedEdu(edu);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/educations/${id}`);
                setEducations(educations.filter(e => e.id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <GraduationCap className="text-primary" /> Education & Certifications
                </h1>
                <button
                    onClick={() => { setSelectedEdu(null); setIsModalOpen(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} /> Add Education
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="text-center p-10">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                        <p className="text-gray-400">Loading education records...</p>
                    </div>
                ) : educations.length === 0 ? (
                    <div className="text-center p-10 glass-card text-gray-400">No education records found.</div>
                ) : (
                    educations.map(edu => (
                        <div key={edu.id} className="glass-card p-6 flex justify-between items-start group">
                            <div>
                                <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                                <p className="text-primary-light font-medium">{edu.institution}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {new Date(edu.startDate).toLocaleDateString()} - {new Date(edu.endDate).toLocaleDateString()}
                                </p>
                                <p className="text-gray-300 mt-4">{edu.description}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(edu)} className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded transition-colors">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(edu.id)} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <EducationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                education={selectedEdu}
            />
        </div>
    );
};

export default ManageEducation;
