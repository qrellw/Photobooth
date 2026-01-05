"use client";

import Script from 'next/script';

export default function OpenCVScript() {
    return (
        <Script
            src="https://docs.opencv.org/4.5.1/opencv.js"
            strategy="beforeInteractive"
            onLoad={() => {
                console.log('OpenCV loaded');
                window.dispatchEvent(new Event('opencv-ready'));
            }}
        />
    );
}
