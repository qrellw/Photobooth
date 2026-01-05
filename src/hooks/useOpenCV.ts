import { useState, useEffect } from 'react';

declare global {
    interface Window {
        cv: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Module: any;
    }
}

export const useOpenCV = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // If cv is already loaded
        if (window.cv && window.cv.Mat) {
            setLoaded(true);
            return;
        }

        // Listen for the custom event we will dispatch when script loads
        const onOpenCVReady = () => {
            setLoaded(true);
        };

        window.addEventListener('opencv-ready', onOpenCVReady);

        // Check periodically just in case event was missed
        const interval = setInterval(() => {
            if (window.cv && window.cv.Mat) {
                setLoaded(true);
                clearInterval(interval);
            }
        }, 500);

        return () => {
            window.removeEventListener('opencv-ready', onOpenCVReady);
            clearInterval(interval);
        };
    }, []);

    return { loaded, cv: typeof window !== 'undefined' ? window.cv : null };
};
