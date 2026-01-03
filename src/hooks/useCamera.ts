import { useState, useEffect, useRef, useCallback } from 'react';

export const useCamera = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const startCamera = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: "user"
                },
                audio: false
            });

            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please check permissions.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        startCamera();
        return () => {
            // Cleanup
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []); // Only run once on mount

    return { videoRef, stream, error, isLoading, startCamera };
};
