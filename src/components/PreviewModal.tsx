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
import { Download, Copy, Trash2, Check } from 'lucide-react';

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
            <DialogContent className="sm:max-w-3xl bg-neutral-900 border-neutral-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                        Your Photos
                    </DialogTitle>
                </DialogHeader>

                <div className="flex items-center justify-center p-4 bg-black/50 rounded-xl">
                    {imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={imageUrl}
                            alt="Collage Preview"
                            className="max-h-[80vh] w-auto rounded-lg shadow-2xl object-contain"
                        />
                    )}
                </div>

                <DialogFooter className="flex gap-2 sm:justify-center">
                    <Button
                        variant="destructive"
                        onClick={onClose}
                        className="flex-1"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Retake
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={handleCopy}
                        className="flex-1"
                    >
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copied ? "Copied" : "Copy"}
                    </Button>

                    <Button
                        onClick={onDownload}
                        className="flex-1 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white border-0"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
