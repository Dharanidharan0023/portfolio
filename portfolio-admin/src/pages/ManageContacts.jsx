import { useState, useEffect, useCallback } from 'react';
import { Phone, Trash2 } from 'lucide-react';
import api from '../utils/axios';

const ManageContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [newContact, setNewContact] = useState({ type: 'Email', value: '', label: '', iconUrl: '' });

    const fetchContacts = useCallback(async () => {
        try {
            const res = await api.get('/contacts');
            setContacts(res.data);
        } catch (err) { console.error(err); }
    }, []);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const handleSaveNew = async (e) => {
        e.preventDefault();
        try {
            await api.post('/contacts', newContact);
            setNewContact({ type: 'Email', value: '', label: '', iconUrl: '' });
            fetchContacts();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/contacts/${id}`);
            fetchContacts();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
                <Phone className="text-primary" /> Contacts & Links
            </h1>

            <div className="glass-card p-6 mb-8">
                <h2 className="text-xl mb-4 font-bold">Add Contact / Social</h2>
                <form onSubmit={handleSaveNew} className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <select value={newContact.type} onChange={e => setNewContact({ ...newContact, type: e.target.value })} className="bg-background border border-gray-700 px-4 py-2 min-w-32">
                            <option value="Email">Email</option>
                            <option value="Phone">Phone</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="GitHub">GitHub</option>
                            <option value="Twitter">Twitter</option>
                            <option value="Other">Other</option>
                        </select>
                        <input required type="text" placeholder="Value (e.g., mail@test.com)" value={newContact.value} onChange={e => setNewContact({ ...newContact, value: e.target.value })} className="bg-background border border-gray-700 px-4 py-2 flex-grow" />
                    </div>
                    <div className="flex gap-4">
                        <input type="text" placeholder="Label (Optional)" value={newContact.label} onChange={e => setNewContact({ ...newContact, label: e.target.value })} className="bg-background border border-gray-700 px-4 py-2 flex-1" />
                        <input type="text" placeholder="Icon URL (Optional)" value={newContact.iconUrl} onChange={e => setNewContact({ ...newContact, iconUrl: e.target.value })} className="bg-background border border-gray-700 px-4 py-2 flex-1" />
                        <button type="submit" className="btn-primary px-8">Add</button>
                    </div>
                </form>
            </div>

            <div className="glass-card p-6">
                <h2 className="text-xl mb-4 font-bold">Active Contacts</h2>
                <div className="space-y-4">
                    {contacts.map(c => (
                        <div key={c.id} className="flex items-center justify-between border-b border-gray-800 pb-2">
                            <div>
                                <strong className="text-primary">{c.type}: </strong>
                                <span className="text-gray-300">{c.value}</span>
                                {c.label && <span className="text-gray-500 text-sm ml-2">({c.label})</span>}
                            </div>
                            <button onClick={() => handleDelete(c.id)} className="text-red-400 p-2"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default ManageContacts;
