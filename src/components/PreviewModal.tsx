"use client";

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Copy, Trash2, Check, X } from 'lucide-react';

interface PreviewModalProps {
    isOpen: boolean;
    imageUrl: string | null;
    onClose: () => void; // Treat as "Back" or "Delete"
    onDownload: () => void;
    onCopy: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
    isOpen, imageUrl, onClose, onDownload, onCopy
}) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        onCopy();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[95vw] md:max-w-3xl p-0 gap-0 bg-[var(--retro-bg)] border-4 border-[var(--retro-border)] shadow-2xl rounded-xl overflow-hidden [&_button[data-slot=dialog-close]]:hidden">
                {/* Retro Header */}
                <div className="h-10 bg-[var(--retro-header)] border-b-4 border-[var(--retro-border)] flex items-center justify-between px-3">
                    <span className="font-bold text-[var(--retro-border)] font-mono uppercase tracking-tight">Preview_Image.bmp</span>
                    <button onClick={onClose} className="p-1 hover:bg-black/10 rounded transition-colors">
                        <X size={20} className="text-[var(--retro-border)]" strokeWidth={3} />
                    </button>
                </div>

                <div className="p-4 md:p-6 flex flex-col items-center gap-4 bg-[var(--retro-bg)]">
                    {/* Image Container with inner shadow/border */}
                    <div className="relative w-full flex items-center justify-center p-2 bg-black/5 border-2 border-[var(--retro-border)] border-dashed rounded-lg min-h-[50vh]">
                        {imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={imageUrl}
                                alt="Collage Preview"
                                className="max-h-[70vh] w-auto shadow-xl border-2 border-white/50"
                            />
                        ) : (
                            <div className="text-[var(--retro-border)] font-mono animate-pulse">Loading image...</div>
                        )}
                    </div>
                </div>

                <DialogFooter className="p-4 border-t-4 border-[var(--retro-border)] bg-[var(--retro-bg)] sm:justify-between gap-3">
                    <Button
                        onClick={onClose}
                        className="flex-1 bg-[#EE5D5D] hover:bg-[#EE5D5D]/90 text-white font-bold border-2 border-[var(--retro-border)] shadow-[4px_4px_0px_0px_rgba(92,58,46,0.3)] active:translate-y-1 active:shadow-none transition-all"
                    >
                        <Trash2 className="w-5 h-5 mr-2" strokeWidth={2.5} />
                        DELETE
                    </Button>

                    <div className="flex gap-3 flex-[2]">
                        <Button
                            onClick={handleCopy}
                            className="flex-1 bg-[var(--retro-header)] hover:bg-[var(--retro-header)]/90 text-[var(--retro-border)] font-bold border-2 border-[var(--retro-border)] shadow-[4px_4px_0px_0px_rgba(92,58,46,0.3)] active:translate-y-1 active:shadow-none transition-all"
                        >
                            {copied ? <Check className="w-5 h-5 mr-2" strokeWidth={2.5} /> : <Copy className="w-5 h-5 mr-2" strokeWidth={2.5} />}
                            {copied ? "COPIED!" : "COPY"}
                        </Button>

                        <Button
                            onClick={onDownload}
                            className="flex-1 bg-[var(--retro-accent)] hover:bg-[var(--retro-accent)]/90 text-[var(--retro-bg)] font-bold border-2 border-[var(--retro-border)] shadow-[4px_4px_0px_0px_rgba(92,58,46,0.3)] active:translate-y-1 active:shadow-none transition-all"
                        >
                            <Download className="w-5 h-5 mr-2" strokeWidth={2.5} />
                            SAVE
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
