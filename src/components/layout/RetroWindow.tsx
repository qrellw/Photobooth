import React from 'react';
import { Minus, Square, X } from 'lucide-react';

interface RetroWindowProps {
    children: React.ReactNode;
    footer?: React.ReactNode;
    title?: string;
}

export const RetroWindow: React.FC<RetroWindowProps> = ({ children, footer, title = "PhotoBooth_v1.0.exe" }) => {
    return (
        <div className="w-full h-full max-w-5xl mx-auto flex flex-col relative animate-in fade-in zoom-in duration-300">
            {/* Shadow layer for depth */}
            <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[var(--retro-border)] rounded-xl -z-10" />

            {/* Main Window Frame */}
            <div className="flex flex-col w-full h-full bg-[var(--retro-bg)] border-4 border-[var(--retro-border)] rounded-xl overflow-hidden shadow-xl">

                {/* Header Bar */}
                <div className="h-12 bg-[var(--retro-header)] border-b-4 border-[var(--retro-border)] flex items-center justify-between px-4 shrink-0 select-none">
                    <div className="font-bold text-[var(--retro-border)] truncate font-mono tracking-tighter text-lg uppercase">
                        {title}
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="text-[var(--retro-border)] hover:bg-[var(--retro-border)]/10 p-1 rounded transition-colors">
                            <Minus size={20} strokeWidth={3} />
                        </button>
                        <button className="text-[var(--retro-border)] hover:bg-[var(--retro-border)]/10 p-1 rounded transition-colors">
                            <Square size={18} strokeWidth={3} />
                        </button>
                        <button className="text-[var(--retro-border)] hover:bg-[var(--retro-border)]/10 p-1 rounded transition-colors">
                            <X size={22} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* content Area - Beige background */}
                <div className="flex-1 overflow-hidden relative p-4 flex flex-col items-center justify-center bg-[var(--retro-bg)]">
                    {children}
                </div>

                {/* Footer Bar (Status/Controls) */}
                {footer && (
                    <div className="border-t-4 border-[var(--retro-border)] bg-[var(--retro-bg)] p-3 shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};
