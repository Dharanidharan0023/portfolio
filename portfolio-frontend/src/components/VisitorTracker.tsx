'use client';

import { useEffect, useRef } from 'react';
import api from '@/lib/api';

/**
 * VisitorTracker Component
 * 
 * Silently records a visit to the backend when the application mounts.
 * Uses a ref to ensure tracking only happens once per page session.
 */
export function VisitorTracker() {
    const trackedRef = useRef(false);

    useEffect(() => {
        if (!trackedRef.current) {
            const trackVisit = async () => {
                try {
                    await api.post('/visitors/track');
                    trackedRef.current = true;
                } catch (error) {
                    // Silently fail to not disrupt user experience
                    console.debug('Visitor tracking failed:', error);
                }
            };

            trackVisit();
        }
    }, []);

    return null; // This component has no UI
}
