import { useState, useEffect } from 'react';
import { User, Save, Loader2, Award } from 'lucide-react';
import api from '../utils/axios';

const ManageProfile = () => {
    const [profile, setProfile] = useState({
        id: 0,
        fullName: '',
        title: '',
        bio: '',
        avatarUrl: '',
        resumeUrl: '',
        leadershipTitle: '',
        leadershipBio: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/profiles');
            if (res.data) {
                setProfile(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch profile', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await api.put(`/profiles/${profile.id || 1}`, profile);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            console.error('Failed to save profile', err);
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-gray-400">Loading profile data...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
                <User className="text-primary" /> Profile Header
            </h1>

            {message.text && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="glass-card p-8 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 border-b border-white/10 pb-4 mb-6">
                        Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Full Name</label>
                            <input type="text" name="fullName" value={profile.fullName || ''} onChange={handleChange} required className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 focus:border-primary outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Professional Title</label>
                            <input type="text" name="title" value={profile.title || ''} onChange={handleChange} required className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 focus:border-primary outline-none transition-colors" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-400">Bio</label>
                            <textarea name="bio" value={profile.bio || ''} onChange={handleChange} rows={4} className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 focus:border-primary outline-none transition-colors resize-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Avatar URL</label>
                            <input type="text" name="avatarUrl" value={profile.avatarUrl || ''} onChange={handleChange} className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 focus:border-primary outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Resume URL</label>
                            <input type="text" name="resumeUrl" value={profile.resumeUrl || ''} onChange={handleChange} className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 focus:border-primary outline-none transition-colors" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-8 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 border-b border-white/10 pb-4 mb-6 text-yellow-500">
                        <Award size={20} /> Leadership & Roles
                    </h2>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Leadership Title</label>
                            <input type="text" name="leadershipTitle" value={profile.leadershipTitle || ''} onChange={handleChange} placeholder="e.g. Student Forum – Cultural President" className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 focus:border-yellow-500 outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Leadership Bio / Achievements</label>
                            <textarea name="leadershipBio" value={profile.leadershipBio || ''} onChange={handleChange} rows={4} placeholder="Describe your leadership roles and impacts..." className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 focus:border-yellow-500 outline-none transition-colors resize-none" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                    <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 px-8 py-3 disabled:opacity-50">
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Full Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManageProfile;
