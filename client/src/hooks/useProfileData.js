import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../server/config/env';

export const useProfileData = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/profile/full`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }

            const data = await response.json();
            setProfileData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    return {
        profileData,
        loading,
        error,
        refreshProfile: fetchProfileData
    };
};