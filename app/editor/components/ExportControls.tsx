// app/editor/components/ExportControls.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { motion } from "framer-motion";

interface Caption {
  id: string;
  start: number;
  end: number;
  text: string;
  style: any;
}

interface ExportControlsProps {
  videoUrl: string;
  captions: Caption[];
}

const ExportControls: React.FC<ExportControlsProps> = ({
  videoUrl,
  captions,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setExportMessage(null);

    try {
      console.log("Initiating video export...");
      console.log("Video URL:", videoUrl);
      console.log("Captions to export:", captions);

      // --- Crucial Part: Backend or ffmpeg-wasm Integration ---
      // Option 1: Send modified captions back to backend for server-side rendering
      // This is generally more robust for complex video processing.
      // const response = await fetch('/api/export-video', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ videoUrl, captions }),
      // });
      // if (!response.ok) {
      //   throw new Error('Video export failed on server.');
      // }
      // const data = await response.json();
      // const exportedVideoUrl = data.downloadUrl;

      // Option 2: Use ffmpeg-wasm for client-side rendering
      // This requires significant setup for ffmpeg.wasm, including loading it,
      // creating the input video, generating a new ASS file from 'captions' data,
      // and then running ffmpeg commands to burn the subtitles.
      // Example pseudo-code (very simplified):
      // const { createFFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg');
      // const ffmpeg = createFFmpeg({ log: true });
      // await ffmpeg.load();
      // ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoUrl));
      // // Generate a new ASS file string from 'captions' state
      // const newAssContent = generateAssFromCaptions(captions); // You need this helper
      // ffmpeg.FS('writeFile', 'subs.ass', newAssContent);
      // await ffmpeg.run('-i', 'input.mp4', '-vf', 'ass=subs.ass', 'output.mp4');
      // const data = ffmpeg.FS('readFile', 'output.mp4');
      // const blob = new Blob([data.buffer], { type: 'video/mp4' });
      // const exportedVideoUrl = URL.createObjectURL(blob);
      // // Don't forget to revoke the Blob URL when done.

      // --- Simulation for demonstration ---
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate 5-second export
      const exportedVideoUrl = "/sample-exported-video.mp4"; // Placeholder for the download URL
      // --- End Simulation ---

      setExportMessage("Video exported successfully! Downloading...");
      // Trigger download
      const a = document.createElement("a");
      a.href = exportedVideoUrl;
      a.download = "caption-ai-video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error: any) {
      console.error("Export error:", error);
      setExportMessage(
        `Export failed: ${error.message || "An unknown error occurred."}`
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {exportMessage && (
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`text-sm ${
            exportMessage.includes("failed") ? "text-red-600" : "text-green-600"
          }`}
        >
          {exportMessage}
        </motion.p>
      )}
      <Button
        onClick={handleExport}
        disabled={isExporting}
        className="px-6 py-2 rounded-lg flex items-center space-x-2"
      >
        {isExporting ? (
          <>
            <Spinner className="w-4 h-4" />
            <span>Exporting...</span>
          </>
        ) : (
          <span>Export Video</span>
        )}
      </Button>
    </div>
  );
};

export default ExportControls;
