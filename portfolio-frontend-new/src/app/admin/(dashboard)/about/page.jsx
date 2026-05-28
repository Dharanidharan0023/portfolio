"use client";

import { useState, useEffect, useCallback } from 'react';
import { AlignLeft, Save, Loader2 } from 'lucide-react';
import api from "@/lib/api";

const ManageAbout = () => {
    const [about, setAbout] = useState({
        id: 0,
        description: '',
        highlights: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const fetchAbout = useCallback(async () => {
        try {
            const res = await api.get('/abouts');
            if (res.data) setAbout(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => {
        fetchAbout();
    }, [fetchAbout]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAbout(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (about.id === 0) {
                const res = await api.post('/abouts', about);
                setAbout(res.data);
            } else {
                await api.put(`/abouts/${about.id}`, about);
            }
            setMessage('About section saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Error saving about section');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
                <AlignLeft className="text-primary" /> About Section
            </h1>
            {message && <div className="p-4 mb-4 bg-primary/20 text-primary border border-primary/50">{message}</div>}
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Description</label>
                    <textarea name="description" value={about.description || ''} onChange={handleChange} rows={6} className="w-full bg-background border border-gray-700 rounded px-4 py-2 focus:border-primary outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Highlights (JSON or Comma separated)</label>
                    <input type="text" name="highlights" value={about.highlights || ''} onChange={handleChange} className="w-full bg-background border border-gray-700 rounded px-4 py-2 focus:border-primary outline-none" />
                </div>
                <button type="submit" disabled={saving} className="btn-primary flex gap-2">
                    <Save size={20} /> {saving ? 'Saving...' : 'Save Configuration'}
                </button>
            </form>
        </div>
    );
};
export default ManageAbout;
