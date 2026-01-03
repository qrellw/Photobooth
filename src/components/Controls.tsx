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
                        <SelectItem value="none">Normal</SelectItem>
                        <SelectItem value="grayscale(100%)">B&W</SelectItem>
                        <SelectItem value="sepia(80%)">Sepia</SelectItem>
                        <SelectItem value="contrast(150%) saturate(0)">Noir</SelectItem>
                        <SelectItem value="saturate(200%) contrast(80%)">Vivid</SelectItem>
                        <SelectItem value="hue-rotate(90deg)">Alien</SelectItem>
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
