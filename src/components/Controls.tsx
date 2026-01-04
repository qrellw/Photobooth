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
}

export const Controls: React.FC<ControlsProps> = ({
    onCapture,
    onFilterChange,
    currentFilter,
    isCapturing
}) => {
    return (
        <div className="flex items-center justify-between w-full max-w-3xl mx-auto p-6 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10">
            {/* Filter Selector */}
            <div className="w-40">
                <Select value={currentFilter} onValueChange={onFilterChange} disabled={isCapturing}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Mặc định</SelectItem>
                        <SelectItem value="brightness(1.2) contrast(1.05) saturate(0.9)">Trắng sáng (Hàn Quốc)</SelectItem>
                        <SelectItem value="brightness(1.1) contrast(1.1) saturate(1.3)">Tươi tắn</SelectItem>
                        <SelectItem value="brightness(1.1) blur(0.5px) contrast(0.95)">Mịn màng (Soft)</SelectItem>
                        <SelectItem value="sepia(0.4) contrast(1.1) brightness(0.9) saturate(0.8)">Vintage</SelectItem>
                        <SelectItem value="contrast(1.15) saturate(0.9) sepia(0.15) brightness(1.05)">Màu Film</SelectItem>
                        <SelectItem value="grayscale(100%)">Trắng đen</SelectItem>
                        <SelectItem value="sepia(80%)">Cổ điển</SelectItem>
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
