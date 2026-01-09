import React, { useState } from 'react';
import { Camera, Settings2, Maximize2 } from 'lucide-react';
import { RetroSettings } from './RetroSettings';

interface ControlsProps {
    onCapture: () => void;
    onFilterChange: (filter: string) => void;
    currentFilter: string;
    isCapturing: boolean;
    layout: 'horizontal' | 'vertical' | 'strip_4';
    onLayoutChange: (layout: 'horizontal' | 'vertical' | 'strip_4') => void;
    photoCount: 3 | 4;
    onPhotoCountChange: (count: 3 | 4) => void;
    selectedTemplate: string;
    onTemplateChange: (template: string) => void;
}

export const Controls: React.FC<ControlsProps> = ({
    onCapture,
    onFilterChange,
    currentFilter,
    isCapturing,
    layout,
    onLayoutChange,
    photoCount,
    onPhotoCountChange,
    selectedTemplate,
    onTemplateChange
}) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return (
        <>
            <div className="flex items-center justify-between w-full px-4">
                {/* Left: Settings Button */}
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    disabled={isCapturing}
                    className="p-3 text-[var(--retro-border)] hover:bg-[var(--retro-border)]/10 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                >
                    <Settings2 size={28} strokeWidth={2.5} />
                </button>

                {/* Center: Capture Button */}
                <button
                    onClick={onCapture}
                    disabled={isCapturing}
                    className="group relative flex items-center justify-center w-20 h-20 rounded-full bg-[var(--retro-accent)] border-4 border-[var(--retro-border)] shadow-[4px_4px_0px_0px_rgba(92,58,46,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(92,58,46,0.3)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all disabled:opacity-80 disabled:cursor-not-allowed"
                >
                    <Camera className="w-8 h-8 text-[#F3EAD3]" strokeWidth={2.5} />
                </button>

                {/* Right: Fullscreen Button */}
                <button
                    onClick={toggleFullScreen}
                    className="p-3 text-[var(--retro-border)] hover:bg-[var(--retro-border)]/10 rounded-xl transition-all active:scale-95"
                >
                    <Maximize2 size={28} strokeWidth={2.5} />
                </button>
            </div>

            {/* Settings Modal */}
            {isSettingsOpen && (
                <RetroSettings
                    filter={currentFilter}
                    onFilterChange={onFilterChange}
                    layout={layout}
                    onLayoutChange={onLayoutChange}
                    photoCount={photoCount}
                    onPhotoCountChange={onPhotoCountChange}
                    selectedTemplate={selectedTemplate}
                    onTemplateChange={onTemplateChange}
                    onClose={() => setIsSettingsOpen(false)}
                />
            )}
        </>
    );
};
