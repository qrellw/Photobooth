"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CameraProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    filter?: string;
    isFlashing?: boolean;
}

export const Camera: React.FC<CameraProps> = ({ videoRef, filter = 'none', isFlashing }) => {
    // Remove internal hook usage. Parent controls stream.
    // const { videoRef, error, isLoading } = useCamera();
    // We assume parent handles loading state or we pass it down.
    // For now, let's keep it simple.

    return (
        <div className="relative w-full h-full overflow-hidden rounded-[2px] shadow-2xl bg-black">
            {/* Video Feed */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={cn(
                    "w-full h-full object-cover transform scale-x-[-1]", // Mirror effect
                    filter // Apply CSS class filter
                )}
                style={{ filter: filter !== 'none' ? filter : undefined }} // Support specialized filter strings if needed
            />

            {/* Flash Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isFlashing ? 1 : 0 }}
                transition={{ duration: 0.1 }}
                className="absolute inset-0 bg-white z-50 pointer-events-none"
            />
        </div>
    );
};
