"use client";

import { useState, useEffect } from 'react';
import { Mail, Trash2, Calendar, User, MessageSquare } from 'lucide-react';
import api from "@/lib/api";

const InboxPage = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await api.get('/contacts/messages');
            setMessages(res.data);
        } catch (err) {
            console.error('Failed to fetch messages', err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewMessage = async (msg) => {
        setSelectedMessage(msg);
        if (!msg.isRead) {
            try {
                await api.get(`/contacts/messages/${msg.id}`);
                // Update local state to mark as read
                setMessages(messages.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
            } catch (err) {
                console.error('Failed to mark message as read', err);
            }
        }
    };

    const handleDeleteMessage = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await api.delete(`/contacts/messages/${id}`);
                setMessages(messages.filter(m => m.id !== id));
                if (selectedMessage?.id === id) {
                    setSelectedMessage(null);
                }
            } catch (err) {
                console.error('Failed to delete message', err);
                alert('Failed to delete message');
            }
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Mail className="text-primary" /> Inbox
                </h1>
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {messages.filter(m => !m.isRead).length} Unread
                </span>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Message List */}
                <div className="w-1/3 glass-card flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-white/10 font-bold text-gray-400 uppercase text-xs tracking-wider">
                        Recent Messages
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading...</div>
                        ) : messages.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No messages found.</div>
                        ) : (
                            messages.map(msg => (
                                <div
                                    key={msg.id}
                                    onClick={() => handleViewMessage(msg)}
                                    className={`p-4 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 ${selectedMessage?.id === msg.id ? 'bg-white/10' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`font-bold text-sm ${!msg.isRead ? 'text-primary' : 'text-gray-300'}`}>
                                            {msg.name}
                                        </span>
                                        <span className="text-[10px] text-gray-500">
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium truncate mb-1">
                                        {msg.subject}
                                    </div>
                                    <div className="text-[11px] text-gray-500 line-clamp-1 italic">
                                        {msg.message}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 glass-card flex flex-col overflow-hidden">
                    {selectedMessage ? (
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b border-white/10 flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">{selectedMessage.subject}</h2>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                        <span className="flex items-center gap-1"><User size={14} /> {selectedMessage.name} ({selectedMessage.email})</span>
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteMessage(e, selectedMessage.id)}
                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                    title="Delete Message"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                            <div className="flex-1 p-8 overflow-y-auto whitespace-pre-wrap text-gray-200 leading-relaxed">
                                {selectedMessage.message}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
                            <MessageSquare size={64} className="mb-4 opacity-10" />
                            <p>Select a message to read</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InboxPage;
