"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Camera } from '@/components/Camera';
import { Controls } from '@/components/Controls';
import { PreviewModal } from '@/components/PreviewModal';
import { RetroWindow } from '@/components/layout/RetroWindow';
import { AnimatePresence, motion } from 'framer-motion';
import { useCamera } from '@/hooks/useCamera';
import { generateCollage, AVAILABLE_TEMPLATES_1X4 } from '@/lib/collage';
import { useOpenCV } from '@/hooks/useOpenCV';

export default function Home() {
  const { loaded: cvLoaded } = useOpenCV();
  const { videoRef, startCamera } = useCamera();
  const [filter, setFilter] = useState('none');
  const [layout, setLayout] = useState<'horizontal' | 'vertical' | 'strip_4'>('horizontal');
  const [photoCount, setPhotoCount] = useState<3 | 4>(3);
  const [selectedTemplate, setSelectedTemplate] = useState(AVAILABLE_TEMPLATES_1X4[0].src);

  useEffect(() => {
    if (cvLoaded) {
      console.log("OpenCV is ready to use!");
    }
  }, [cvLoaded]);
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
        // Horizontal Capture (Standard) & Strip 1x4 (Photos are landscape)
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

      if (newPhotos.length < photoCount) {
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
      const url = await generateCollage(photos, layout, layout === 'strip_4' ? selectedTemplate : undefined);
      setCollageUrl(url);
      setStatus('review');
    } catch (e) {
      console.error(e);
      alert("Lỗi khi tạo ảnh: " + e);
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

  const handlePhotoCountChange = (count: 3 | 4) => {
    setPhotoCount(count);
    if (count === 4) {
      setLayout('strip_4');
    } else {
      setLayout('horizontal');
    }
  };

  return (
    <main className="min-h-screen bg-[#E5DCC5] flex items-center justify-center p-4">
      <RetroWindow
        title="📷 PhotoBooth.exe"
        footer={
          <Controls
            onCapture={startSession}
            onFilterChange={setFilter}
            currentFilter={filter}
            isCapturing={status !== 'idle'}
            layout={layout}
            onLayoutChange={setLayout}
            photoCount={photoCount}
            onPhotoCountChange={handlePhotoCountChange}
            selectedTemplate={selectedTemplate}
            onTemplateChange={setSelectedTemplate}
          />
        }
      >
        {/* Camera Container */}
        <div className="relative w-full h-full flex items-center justify-center rounded-lg overflow-hidden border-2 border-[var(--retro-border)] bg-black shadow-inner">
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
                <span className="text-[8rem] font-bold text-[var(--retro-header)] drop-shadow-[4px_4px_0px_var(--retro-border)] font-mono">
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
                <span className="text-3xl text-white font-bold animate-pulse font-mono uppercase tracking-widest">
                  Processing...
                </span>
              </motion.div>
            )}

            {/* Shot Indicator (1/3) */}
            {status === 'countdown' && countdown !== null && (
              <div className="absolute top-4 right-4 bg-[var(--retro-header)] px-3 py-1 border-2 border-[var(--retro-border)] rounded shadow-[2px_2px_0px_0px_var(--retro-border)]">
                <span className="text-[var(--retro-border)] font-bold text-lg font-mono">
                  {currentShot}/{photoCount}
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </RetroWindow>



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

