"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Settings2, Image as ImageIcon } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface ControlsProps {
    onCapture: () => void;
    onFilterChange: (filter: string) => void;
    currentFilter: string;
    isCapturing: boolean;
    layout: 'horizontal' | 'vertical';
    onLayoutChange: (layout: 'horizontal' | 'vertical') => void;
}

export const Controls: React.FC<ControlsProps> = ({
    onCapture,
    onFilterChange,
    currentFilter,
    isCapturing,
    layout,
    onLayoutChange
}) => {
    return (
        <div className="flex items-center justify-between w-full max-w-3xl mx-auto p-6 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 gap-4">
            {/* Filter Selector */}
            <div className="flex gap-4">
                <Select value={layout} onValueChange={(v) => onLayoutChange(v as 'horizontal' | 'vertical')} disabled={isCapturing}>
                    <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Layout" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="horizontal">Khổ Ngang</SelectItem>
                        <SelectItem value="vertical">Khổ Dọc</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={currentFilter} onValueChange={onFilterChange} disabled={isCapturing}>
                    <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
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

            {/* Shutter Button */}
            <Button
                size="icon"
                className="w-20 h-20 rounded-full bg-white hover:bg-gray-200 text-black shadow-lg shadow-white/20 transition-all active:scale-95"
                onClick={onCapture}
                disabled={isCapturing}
            >
                <Camera className="w-10 h-10" />
            </Button>

            {/* Gallery / Placeholder */}
            <Button variant="ghost" size="icon" className="w-12 h-12 text-white/70 hover:text-white hover:bg-white/10">
                <ImageIcon className="w-8 h-8" />
            </Button>
        </div>
    );
};
