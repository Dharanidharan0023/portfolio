import { useState, useEffect } from 'react';
import useAdminAuth from "../hooks/useAdminAuth";
import api from '../utils/axios';

const ManageAchievements = () => {
    const isAuthorized = useAdminAuth();
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthorized) return; // prevent API call until auth verified
        fetchAchievements();
    }, [isAuthorized]);

    const fetchAchievements = async () => {
        try {
            const res = await api.get('/achievements');
            setAchievements(res.data);
        } catch (err) {
            console.error('Failed to fetch achievements', err);
        } finally {
            setLoading(false);
        }
    };

    // handleSave, handleEdit, handleDelete stay the same
    // ...

    return (
        <div>
            {/* Your existing JSX */}
        </div>
    );
};

export default ManageAchievements;