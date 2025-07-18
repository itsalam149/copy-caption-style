// app/editor/components/VideoTimeline.tsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Caption {
  id: string;
  start: number;
  end: number;
  text: string;
  style: any; // Simplified for now
}

interface VideoTimelineProps {
  videoUrl: string;
  captions: Caption[];
  onSelectCaption: (caption: Caption | null) => void;
  selectedCaption: Caption | null;
}

const VideoTimeline: React.FC<VideoTimelineProps> = ({
  videoUrl,
  captions,
  onSelectCaption,
  selectedCaption,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [videoDuration, setVideoDuration] = useState(0);

  useEffect(() => {
    // A robust way to get video duration on the client side
    const tempVideo = document.createElement("video");
    tempVideo.src = videoUrl;
    tempVideo.onloadedmetadata = () => {
      setVideoDuration(tempVideo.duration);
      tempVideo.remove(); // Clean up the temporary element
    };
    tempVideo.onerror = () => {
      console.error("Error loading video metadata for timeline:", videoUrl);
      setVideoDuration(0); // Reset or handle error state
      tempVideo.remove();
    };
    // If metadata is already loaded (e.g., cached by browser), this might not fire.
    // Check readyState to handle synchronous availability.
    if (tempVideo.readyState >= 1) {
      // HAVE_METADATA or greater
      setVideoDuration(tempVideo.duration);
      tempVideo.remove();
    }
    // No return cleanup needed for `tempVideo` as it removes itself.
  }, [videoUrl]);

  const pixelsPerSecond = 80; // Adjust as needed for zoom level and detail

  // Helper for formatting time (MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold text-sky-blue-800 mb-4">
        Video Timeline
      </h3>
      <div className="flex-1 overflow-x-auto relative pb-4 custom-scrollbar">
        {" "}
        {/* Add custom-scrollbar class for styling */}
        <div
          ref={timelineRef}
          className="relative h-full min-h-[100px] bg-sky-blue-50 rounded-lg flex items-center"
          style={{
            width: `${Math.max(
              window.innerWidth,
              videoDuration * pixelsPerSecond
            )}px`,
          }} // Ensure minimum width for visibility
        >
          {/* Timeline ruler/markers */}
          {Array.from({ length: Math.ceil(videoDuration / 5) + 1 }).map(
            (_, i) => (
              <div
                key={`marker-${i}`}
                className="absolute top-0 h-full border-l border-sky-blue-200 text-xs text-gray-500 pt-1 px-1 flex flex-col justify-between"
                style={{ left: `${i * 5 * pixelsPerSecond}px` }}
              >
                <span className="h-2 w-px bg-gray-300 block mb-1"></span>
                <span>{formatTime(i * 5)}</span>
              </div>
            )
          )}

          {captions.map((caption) => (
            <div
              key={caption.id}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 h-12 bg-primary-light rounded-md cursor-pointer flex items-center justify-center p-2 text-white text-xs overflow-hidden whitespace-nowrap text-ellipsis",
                "hover:bg-primary transition-colors duration-200",
                selectedCaption?.id === caption.id
                  ? "border-2 border-primary-dark shadow-md ring-2 ring-primary-dark"
                  : ""
              )}
              style={{
                left: `${caption.start * pixelsPerSecond}px`,
                width: `${(caption.end - caption.start) * pixelsPerSecond}px`,
                minWidth: "20px", // Ensure visibility for very short captions
              }}
              onClick={() => onSelectCaption(caption)}
              title={caption.text} // Show full text on hover
            >
              {caption.text}
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Video Duration: {formatTime(videoDuration)}
      </p>
    </div>
  );
};

export default VideoTimeline;
