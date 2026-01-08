"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Settings2, Image as ImageIcon } from 'lucide-react';
import { AVAILABLE_TEMPLATES_1X4 } from '@/lib/collage';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { LayoutTemplate } from 'lucide-react';

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
    return (
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-3xl mx-auto p-4 md:p-6 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 gap-4 md:gap-8">
            {/* Filter Selector & Template Selector - Grid on Mobile, Flex on Desktop */}
            <div className="grid grid-cols-2 gap-3 w-full md:flex md:flex-row md:items-center md:justify-center md:gap-3">

                {/* 1x4 Template Selector Button */}
                {layout === 'strip_4' && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full md:w-32 bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2 h-10 px-2">
                                <LayoutTemplate className="w-4 h-4 shrink-0" />
                                <span className="truncate">Frame</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] md:max-w-2xl bg-black/90 border-white/10 text-white p-3 md:p-6 rounded-xl">
                            <DialogHeader>
                                <DialogTitle>Chọn Frame</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-3 gap-2 md:gap-6 p-1 max-h-[60vh] md:max-h-[70vh] overflow-y-auto">
                                {AVAILABLE_TEMPLATES_1X4.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => onTemplateChange(t.src)}
                                        className={`group relative aspect-[1/3] rounded-lg overflow-hidden border-2 md:border-4 transition-all ${selectedTemplate === t.src
                                                ? 'border-blue-500 shadow-xl shadow-blue-500/20 z-10'
                                                : 'border-white/10 hover:border-white/50 z-0'
                                            }`}
                                    >
                                        <img
                                            src={t.src}
                                            alt={t.alt}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 text-center text-sm font-medium">
                                            {t.alt}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

                {/* Photo Count Selector */}
                <Select
                    value={photoCount.toString()}
                    onValueChange={(v) => onPhotoCountChange(parseInt(v) as 3 | 4)}
                    disabled={isCapturing}
                >
                    <SelectTrigger className="w-full md:w-24 bg-white/10 border-white/20 text-white h-10">
                        <SelectValue placeholder="Shots" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="3">3 Ảnh</SelectItem>
                        <SelectItem value="4">4 Ảnh</SelectItem>
                    </SelectContent>
                </Select>

                {/* Layout Selector */}
                <Select
                    value={layout}
                    onValueChange={(v) => onLayoutChange(v as 'horizontal' | 'vertical' | 'strip_4')}
                    disabled={isCapturing || photoCount === 4}
                >
                    <SelectTrigger className="w-full md:w-32 bg-white/10 border-white/20 text-white h-10">
                        <SelectValue placeholder="Layout" />
                    </SelectTrigger>
                    <SelectContent>
                        {photoCount === 4 ? (
                            <SelectItem value="strip_4">Dải 1x4</SelectItem>
                        ) : (
                            <>
                                <SelectItem value="horizontal">Khổ Ngang</SelectItem>
                                <SelectItem value="vertical">Khổ Dọc</SelectItem>
                            </>
                        )}
                    </SelectContent>
                </Select>

                <Select value={currentFilter} onValueChange={onFilterChange} disabled={isCapturing}>
                    <SelectTrigger className="w-full md:w-40 bg-white/10 border-white/20 text-white h-10">
                        <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">
                            Mặc định
                        </SelectItem>

                        {/* 🇰🇷 Trắng sáng Hàn Quốc – sáng vừa, da không bệt */}
                        <SelectItem value="brightness(1.08) contrast(1.04) saturate(0.95)">
                            Trắng sáng (Hàn Quốc)
                        </SelectItem>

                        {/* 🌈 Tươi tắn – tăng màu nhẹ, không đỏ da */}
                        <SelectItem value="brightness(1.07) contrast(1.05) saturate(1.15)">
                            Tươi tắn
                        </SelectItem>

                        {/* ✨ Mịn màng – blur rất nhẹ, không fake */}
                        <SelectItem value="brightness(1.05) contrast(0.98) saturate(0.95) blur(0.4px)">
                            Mịn màng (Soft)
                        </SelectItem>

                        {/* 🎞 Vintage sạch – không ám bẩn */}
                        <SelectItem value="sepia(0.25) contrast(1.05) brightness(0.98) saturate(0.85)">
                            Vintage
                        </SelectItem>

                        {/* 🎥 Film – màu dịu, kiểu phòng chụp */}
                        <SelectItem value="contrast(1.06) saturate(0.9) sepia(0.15) brightness(1.03)">
                            Màu Film
                        </SelectItem>

                        {/* ⚫ Trắng đen – rõ mặt, không gắt */}
                        <SelectItem value="grayscale(100%) contrast(1.05) brightness(1.05)">
                            Trắng đen
                        </SelectItem>

                        {/* 🟤 Cổ điển – sepia vừa phải */}
                        <SelectItem value="sepia(0.6) contrast(1.03) brightness(1.02)">
                            Cổ điển
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Shutter Button - Centered on Mobile */}
            <Button
                size="icon"
                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white hover:bg-gray-200 text-black shadow-lg shadow-white/20 transition-all active:scale-95 shrink-0"
                onClick={onCapture}
                disabled={isCapturing}
            >
                <Camera className="w-8 h-8 md:w-10 md:h-10" />
            </Button>

            {/* Gallery / Placeholder - Hidden on very small screens if needed, or adjusted */}
            <Button variant="ghost" size="icon" className="w-12 h-12 text-white/70 hover:text-white hover:bg-white/10 hidden md:flex">
                <ImageIcon className="w-8 h-8" />
            </Button>
        </div>
    );
};
