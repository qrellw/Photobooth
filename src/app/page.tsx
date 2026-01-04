"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Camera } from '@/components/Camera';
import { Controls } from '@/components/Controls';
import { PreviewModal } from '@/components/PreviewModal';
import { AnimatePresence, motion } from 'framer-motion';
import { useCamera } from '@/hooks/useCamera';
import { generateCollage } from '@/lib/collage';
import { ModeToggle } from '@/components/ui/ThemeToggle';
export default function Home() {
  const { videoRef, startCamera } = useCamera();
  const [filter, setFilter] = useState('none');
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const [isFlashing, setIsFlashing] = useState(false);

  // State Machine: 'idle' | 'countdown' | 'capturing' | 'processing' | 'review'
  const [status, setStatus] = useState('idle');
  const [currentShot, setCurrentShot] = useState(0); // 1, 2, 3
  const [countdown, setCountdown] = useState<number | null>(null);

  const [rawPhotos, setRawPhotos] = useState<string[]>([]);
  const [collageUrl, setCollageUrl] = useState<string | null>(null);

  // Initialize camera on mount
  useEffect(() => {
    startCamera();
  }, [startCamera]);

  const captureImage = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");

      if (layout === 'vertical') {
        // Vertical Capture (9:16) - Crop from center
        // Assuming video is usually 16:9 (landscape) e.g. 640x480 or 1920x1080
        const videoAspect = video.videoWidth / video.videoHeight;
        const targetAspect = 9 / 16;

        let drawW, drawH, startX, startY;

        // Our video is likely wider than target (1.77 > 0.56)
        // So we fit height, crop width
        const contentHeight = video.videoHeight;
        const contentWidth = contentHeight * targetAspect; // Height * 9/16

        drawW = contentWidth;
        drawH = contentHeight;
        startX = (video.videoWidth - contentWidth) / 2;
        startY = 0;

        canvas.width = contentWidth;
        canvas.height = contentHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          if (filter !== 'none') {
            ctx.filter = filter;
          }
          // Draw the cropped portion
          ctx.drawImage(video, startX, startY, drawW, drawH, 0, 0, canvas.width, canvas.height);
          return canvas.toDataURL("image/jpeg", 0.95);
        }
      } else {
        // Horizontal Capture (Standard)
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          if (filter !== 'none') {
            ctx.filter = filter;
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          return canvas.toDataURL("image/jpeg", 0.95);
        }
      }
    }
    return null;
  };

  const startSession = () => {
    if (status !== 'idle') return;
    setStatus('countdown');
    setRawPhotos([]);
    setCurrentShot(1);
    setCountdown(5); // Initial 5s countdown
  };

  // Countdown Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      // Time to snap
      setCountdown(null);
      performShot();
    }
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  const performShot = () => {
    // Flash
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 150);

    const photo = captureImage();
    if (photo) {
      const newPhotos = [...rawPhotos, photo];
      setRawPhotos(newPhotos);

      if (newPhotos.length < 3) {
        // Next shot
        setCurrentShot(prev => prev + 1);
        // Short delay before next countdown
        setTimeout(() => {
          setCountdown(5); // 5 seconds between shots
        }, 1000);
      } else {
        // Finish state
        finishSession(newPhotos);
      }
    }
  };

  const finishSession = async (photos: string[]) => {
    setStatus('processing');
    try {
      const url = await generateCollage(photos, layout);
      setCollageUrl(url);
      setStatus('review');
    } catch (e) {
      console.error(e);
      setStatus('idle');
    }
  };

  // Actions
  const handleReset = () => {
    setStatus('idle');
    setCollageUrl(null);
    setRawPhotos([]);
    setCurrentShot(0);
  };

  const handleDownload = () => {
    if (collageUrl) {
      const link = document.createElement("a");
      link.href = collageUrl;
      link.download = `photobooth_${Date.now()}.jpg`;
      link.click();
    }
  };

  const handleCopy = async () => {
    if (collageUrl) {
      try {
        const blob = await (await fetch(collageUrl)).blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
      } catch (err) {
        console.error("Copy failed", err);
      }
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 gap-8 relative">

      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 ">
        <ModeToggle />
      </div>

      {/* Camera Container */}
      <div
        className={`relative overflow-hidden shadow-2xl border border-white/5 bg-black transition-all duration-300 ${layout === 'horizontal'
            ? 'w-full max-w-5xl aspect-[16/9] rounded-3xl'
            : 'h-[80vh] aspect-[9/16] rounded-2xl'
          }`}
      >
        <Camera videoRef={videoRef} filter={filter} isFlashing={isFlashing} />

        {/* Messages / Countdown */}
        <AnimatePresence>
          {/* Countdown Number */}
          {countdown !== null && (
            <motion.div
              key={countdown + "-count"}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
            >
              <span className="text-[10rem] font-bold text-white drop-shadow-lg font-mono">
                {countdown}
              </span>
            </motion.div>
          )}

          {/* Status Text (Get Ready / Processing) */}
          {status === 'processing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center"
            >
              <span className="text-4xl text-white font-bold animate-pulse">Processing Magic...</span>
            </motion.div>
          )}

          {/* Shot Indicator (1/3) */}
          {status === 'countdown' && countdown !== null && (
            <div className="absolute top-8 right-8 bg-black/50 px-4 py-2 rounded-full text-white font-bold text-xl z-30 border border-white/20">
              Shot {currentShot}/3
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <Controls
        onCapture={startSession}
        onFilterChange={setFilter}
        currentFilter={filter}
        isCapturing={status !== 'idle'}
        layout={layout}
        onLayoutChange={setLayout}
      />

      {/* Preview Modal */}
      <PreviewModal
        isOpen={status === 'review'}
        imageUrl={collageUrl}
        onClose={handleReset}
        onDownload={handleDownload}
        onCopy={handleCopy}
      />

    </main>
  );
}

