import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AVAILABLE_TEMPLATES_1X4 } from '@/lib/collage';
import { X, Plus, ImagePlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { UploadFrameModal } from './UploadFrameModal';

interface RetroSettingsProps {
    filter: string;
    onFilterChange: (filter: string) => void;
    layout: 'horizontal' | 'vertical' | 'strip_4';
    onLayoutChange: (layout: 'horizontal' | 'vertical' | 'strip_4') => void;
    photoCount: 3 | 4;
    onPhotoCountChange: (count: 3 | 4) => void;
    selectedTemplate: string;
    onTemplateChange: (template: string) => void;
    onClose: () => void;
}

export const RetroSettings: React.FC<RetroSettingsProps> = ({
    filter,
    onFilterChange,
    layout,
    onLayoutChange,
    photoCount,
    onPhotoCountChange,
    selectedTemplate,
    onTemplateChange,
    onClose
}) => {
    const [remoteFrames, setRemoteFrames] = useState<any[]>([]);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const fetchFrames = useCallback(async () => {
        const { data } = await supabase
            .from('frames')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) {
            setRemoteFrames(data);
        }
    }, []);

    useEffect(() => {
        if (layout === 'strip_4') {
            fetchFrames();
        }
    }, [layout, fetchFrames]);

    // Merge local and remote templates
    const allTemplates = [
        ...AVAILABLE_TEMPLATES_1X4,
        ...remoteFrames.map(f => ({
            id: `remote-${f.id}`,
            src: f.url,
            alt: f.name
        }))
    ];

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Shadow layer */}
            <div className="absolute w-full h-full max-w-sm max-h-[500px] translate-x-2 translate-y-2 bg-[var(--retro-border)] rounded-xl -z-10" />

            <div className="w-full max-w-md bg-[var(--retro-bg)] border-4 border-[var(--retro-border)] rounded-xl shadow-2xl flex flex-col h-auto max-h-[80vh]">
                <div className="h-10 border-b-4 border-[var(--retro-border)] bg-[var(--retro-header)] flex items-center justify-between px-3">
                    <span className="font-bold text-[var(--retro-border)] tracking-tight uppercase">Settings.exe</span>
                    <button onClick={onClose} className="p-1 hover:bg-black/10 rounded">
                        <X size={20} className="text-[var(--retro-border)]" strokeWidth={3} />
                    </button>
                </div>

                <div className="p-4 space-y-6 overflow-y-auto">
                    {/* Filter Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[var(--retro-border)] uppercase tracking-wider">Color Filter</label>
                        <Select value={filter} onValueChange={onFilterChange}>
                            <SelectTrigger className="w-full bg-white border-2 border-[var(--retro-border)] text-[var(--retro-border)] font-medium rounded-lg shadow-sm focus:ring-0 focus:ring-offset-0">
                                <SelectValue placeholder="Select Filter" />
                            </SelectTrigger>
                            <SelectContent className="border-2 border-[var(--retro-border)] bg-[#FFF9E5]">
                                <SelectItem value="none">Normal</SelectItem>
                                <SelectItem value="brightness(1.08) contrast(1.04) saturate(0.95)">Korean Bright</SelectItem>
                                <SelectItem value="brightness(1.07) contrast(1.05) saturate(1.15)">Vibrant</SelectItem>
                                <SelectItem value="brightness(1.05) contrast(0.98) saturate(0.95) blur(0.4px)">Soft</SelectItem>
                                <SelectItem value="sepia(0.25) contrast(1.05) brightness(0.98) saturate(0.85)">Vintage</SelectItem>
                                <SelectItem value="contrast(1.06) saturate(0.9) sepia(0.15) brightness(1.03)">Film</SelectItem>
                                <SelectItem value="grayscale(100%) contrast(1.05) brightness(1.05)">B&W</SelectItem>
                                <SelectItem value="sepia(0.6) contrast(1.03) brightness(1.02)">Classic Sepia</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Photo Count */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[var(--retro-border)] uppercase tracking-wider">Shots</label>
                        <div className="flex bg-white border-2 border-[var(--retro-border)] rounded-lg p-1">
                            <button
                                onClick={() => onPhotoCountChange(3)}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${photoCount === 3
                                    ? 'bg-[var(--retro-accent)] text-white shadow-md'
                                    : 'text-[var(--retro-border)] hover:bg-[var(--retro-bg)]'
                                    }`}
                            >
                                3 Shots
                            </button>
                            <button
                                onClick={() => onPhotoCountChange(4)}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${photoCount === 4
                                    ? 'bg-[var(--retro-accent)] text-white shadow-md'
                                    : 'text-[var(--retro-border)] hover:bg-[var(--retro-bg)]'
                                    }`}
                            >
                                4 Shots
                            </button>
                        </div>
                    </div>

                    {/* Layout */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[var(--retro-border)] uppercase tracking-wider">Layout Format</label>
                        <Select value={layout} onValueChange={(v: any) => onLayoutChange(v)} disabled={photoCount === 4}>
                            <SelectTrigger className="w-full bg-white border-2 border-[var(--retro-border)] text-[var(--retro-border)] font-medium rounded-lg">
                                <SelectValue placeholder="Select Layout" />
                            </SelectTrigger>
                            <SelectContent className="border-2 border-[var(--retro-border)] bg-[#FFF9E5]">
                                {photoCount === 4 ? (
                                    <SelectItem value="strip_4">Strip 1x4</SelectItem>
                                ) : (
                                    <>
                                        <SelectItem value="horizontal">Horizontal (Landscape)</SelectItem>
                                        <SelectItem value="vertical">Vertical (Portrait)</SelectItem>
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Frame Selection (Only for 4 shots) */}
                    {layout === 'strip_4' && (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[var(--retro-border)] uppercase tracking-wider">Frame Style</label>
                            <div className="grid grid-cols-3 gap-2 py-2">
                                {/* Add Frame Button */}
                                <button
                                    onClick={() => setIsUploadOpen(true)}
                                    className="border-2 border-[var(--retro-border)] border-dashed rounded-lg flex flex-col items-center justify-center p-2 opacity-60 hover:opacity-100 hover:bg-black/5 transition-all aspect-[1/3] group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[var(--retro-border)] text-[#F3EAD3] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                        <Plus size={20} strokeWidth={3} />
                                    </div>
                                    <span className="text-[10px] font-bold text-[var(--retro-border)] text-center leading-tight">ADD NEW</span>
                                </button>

                                {allTemplates.map((t) => (
                                    <div
                                        key={t.id}
                                        onClick={() => onTemplateChange(t.src)}
                                        className={`cursor-pointer border-2 rounded-lg overflow-hidden relative aspect-[1/3] transition-all ${selectedTemplate === t.src
                                            ? 'border-[var(--retro-accent)] ring-2 ring-[var(--retro-accent)] ring-offset-1'
                                            : 'border-[var(--retro-border)] opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={t.src} className="w-full h-full object-cover" alt={t.alt} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t-2 border-[var(--retro-border)] bg-[var(--retro-bg)]">
                    <Button
                        onClick={onClose}
                        className="w-full bg-[var(--retro-border)] text-[#F3EAD3] hover:bg-[var(--retro-border)]/90 font-bold border-2 border-[var(--retro-border)] shadow-[4px_4px_0px_0px_rgba(92,58,46,0.3)] active:translate-y-1 active:shadow-none transition-all"
                    >
                        DONE
                    </Button>
                </div>
            </div>

            {/* Upload Modal */}
            {isUploadOpen && (
                <UploadFrameModal
                    onClose={() => setIsUploadOpen(false)}
                    onUploadSuccess={() => {
                        fetchFrames();
                        // Optional: Select the newly uploaded frame? 
                        // For now just refresh list.
                    }}
                />
            )}
        </div>
    );
};
