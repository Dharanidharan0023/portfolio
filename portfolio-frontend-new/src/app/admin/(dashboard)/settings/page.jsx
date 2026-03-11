"use client";

import { useState, useEffect, useCallback } from 'react';
import { Settings, Save } from 'lucide-react';
import api from "@/lib/api";

const ManageSettings = () => {
    const [settings, setSettings] = useState([]);
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');

    const fetchSettings = useCallback(async () => {
        try {
            const res = await api.get('/settings');
            setSettings(res.data);
        } catch (err) { console.error(err); }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleSaveNew = async (e) => {
        e.preventDefault();
        try {
            await api.post('/settings', { key: newKey, value: newValue });
            setNewKey(''); setNewValue('');
            fetchSettings();
        } catch (err) { console.error(err); }
    };

    const handleUpdate = async (id, key, value) => {
        try {
            await api.put(`/settings/${id}`, { id, key, value });
            fetchSettings();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
                <Settings className="text-primary" /> Site Settings
            </h1>

            <div className="glass-card p-6 mb-8">
                <h2 className="text-xl mb-4 font-bold">Add New Setting (e.g. SEO_TITLE, THEME)</h2>
                <form onSubmit={handleSaveNew} className="flex gap-4">
                    <input required type="text" placeholder="Key (e.g., SEO_TITLE)" value={newKey} onChange={e => setNewKey(e.target.value)} className="bg-background border border-gray-700 px-4 py-2 flex-1" />
                    <input required type="text" placeholder="Value" value={newValue} onChange={e => setNewValue(e.target.value)} className="bg-background border border-gray-700 px-4 py-2 flex-2" />
                    <button type="submit" className="btn-primary">Add</button>
                </form>
            </div>

            <div className="glass-card p-6">
                <h2 className="text-xl mb-4 font-bold">Current Settings</h2>
                {settings.map(val => (
                    <div key={val.id} className="flex gap-4 mb-4 items-center">
                        <input type="text" value={val.key} readOnly className="bg-white/5 border border-white/10 px-4 py-2 flex-1 text-gray-400" />
                        <input type="text" defaultValue={val.value} onBlur={(e) => handleUpdate(val.id, val.key, e.target.value)} className="bg-background border border-gray-700 px-4 py-2 flex-2 flex-grow" />
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ManageSettings;
