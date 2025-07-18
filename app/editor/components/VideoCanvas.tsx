// app/editor/components/VideoCanvas.tsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
// Import any video player library here, e.g., 'react-player', or directly use <video>
// For ASS rendering, you might look into:
// - libass.js (complex, but accurate)
// - Writing a custom canvas renderer (more basic, might not support all ASS features)
// - Overlaying HTML elements if styling is simpler than full ASS spec

interface Caption {
  id: string;
  start: number; // in seconds
  end: number;   // in seconds
  text: string;
  style: {
    font: string;
    size: number;
    color: string; // Hex or RGBA
    position: 'top' | 'center' | 'bottom' | 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right';
    // Add more ASS-specific styles like outline, shadow, alignment, padding etc.
  };
}

interface VideoCanvasProps {
  videoUrl: string;
  captions: Caption[];
  // Add more props as needed, e.g., current time, playing state from parent
}

const VideoCanvas: React.FC<VideoCanvasProps> = ({ videoUrl, captions }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match video
    const handleVideoMetadataLoaded = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      // Re-draw initial captions if any
      drawCaptions(ctx, video, captions, video.currentTime);
    };
    video.addEventListener('loadedmetadata', handleVideoMetadataLoaded);

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      drawCaptions(ctx, video, captions, video.currentTime);
    };
    video.addEventListener('timeupdate', handleTimeUpdate);

    // Initial draw
    drawCaptions(ctx, video, captions, 0);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleVideoMetadataLoaded);
    };
  }, [videoUrl, captions]); // Re-run effect if videoUrl or captions change

  // This is a simplified drawing function for demonstration.
  // Full ASS rendering with all its styles, positioning, and effects is highly complex
  // and usually requires a dedicated library (e.g., libass.js ported to WebAssembly).
  const drawCaptions = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement, captions: Caption[], time: number) => {
    ctx.clearRect(0, 0, video.videoWidth, video.videoHeight); // Clear previous frame

    // Filter captions that are active at the current time
    const activeCaptions = captions.filter(
      (cap) => time >= cap.start && time <= cap.end
    );

    activeCaptions.forEach((caption) => {
      const { text, style } = caption;

      // Basic styling
      ctx.font = `${style.size}px "${style.font}", sans-serif`; // Ensure font name is quoted
      ctx.fillStyle = style.color;

      // Basic alignment (ASS supports much more complex alignment)
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic'; // Usually more reliable for vertical positioning

      // Basic positioning logic (highly simplified)
      let x = video.videoWidth / 2;
      let y = video.videoHeight - (style.size * 1.5); // Default to bottom with some padding

      if (style.position.includes('top')) {
        y = style.size + 20; // Some padding from top
      } else if (style.position === 'center') {
        y = video.videoHeight / 2 + style.size / 2;
      }
      // Horizontal adjustments for left/right
      if (style.position.includes('left')) {
        x = 20; // Padding from left
        ctx.textAlign = 'left';
      } else if (style.position.includes('right')) {
        x = video.videoWidth - 20; // Padding from right
        ctx.textAlign = 'right';
      }

      // Draw text
      // For stroke/shadow, you'd add:
      // ctx.strokeStyle = 'black';
      // ctx.lineWidth = 2;
      // ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
    });
  };

  return (
    <div className="relative w-full h-full">
      <video ref={videoRef} src={videoUrl} controls className="w-full h-full object-contain bg-black rounded-2xl z-0"></video>
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none"></canvas>
    </div>
  );
};

export default VideoCanvas;