// app/editor/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card"; // Assuming '@/components/ui/Card' is the path
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

// Placeholder components for the editor
import VideoCanvas from "./components/VideoCanvas";
import VideoTimeline from "./components/VideoTimeline";
import CaptionPanel from "./components/CaptionPanel";
import ExportControls from "./components/ExportControls";
// import { parseAss } from '@/lib/assParser'; // You'll need to implement this for actual ASS parsing

export default function VideoEditorPage() {
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get("videoUrl");
  const assUrl = searchParams.get("assUrl");

  const [videoLoaded, setVideoLoaded] = useState(false);
  const [captions, setCaptions] = useState<any[]>([]); // This will hold parsed ASS data
  const [selectedCaption, setSelectedCaption] = useState<any | null>(null);

  useEffect(() => {
    if (!videoUrl || !assUrl) {
      // Handle missing URLs, e.g., redirect to get-started or show error
      console.error("Video URL or ASS URL missing from query parameters.");
      // router.push('/get-started'); // Example redirect
      return;
    }

    // Simulate fetching and parsing ASS file
    const fetchAndParseAss = async () => {
      try {
        console.log(`Fetching ASS from: ${assUrl}`);
        // In a real app, you'd fetch the ASS file from assUrl
        // const response = await fetch(assUrl);
        // if (!response.ok) {
        //   throw new Error('Failed to fetch ASS file.');
        // }
        // const assText = await response.text();
        // const parsedCaptions = parseAss(assText); // Use your actual ASS parser here

        // For demonstration, a dummy structure
        const parsedCaptions = [
          {
            id: "1",
            start: 0.5,
            end: 3.5,
            text: "Hello, Caption-AI World!",
            style: {
              font: "Inter",
              size: 48,
              color: "#FFFFFF",
              position: "center",
            },
          },
          {
            id: "2",
            start: 4.0,
            end: 8.0,
            text: "Your creative captions, made easy.",
            style: {
              font: "Space Mono",
              size: 36,
              color: "#FFFF00",
              position: "bottom-left",
            },
          },
          {
            id: "3",
            start: 8.5,
            end: 12.0,
            text: "Apply stunning styles from any Reel.",
            style: {
              font: "Inter",
              size: 40,
              color: "#FF7F00",
              position: "top-right",
            },
          },
        ];
        setCaptions(parsedCaptions);
        setVideoLoaded(true);
      } catch (err) {
        console.error("Error loading or parsing ASS file:", err);
        // Handle error, e.g., show a message to the user
      }
    };

    fetchAndParseAss();
  }, [videoUrl, assUrl]);

  if (!videoUrl || !assUrl || !videoLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-blue-50">
        <Spinner className="w-10 h-10 text-primary" />
        <p className="ml-3 text-lg text-sky-blue-700">Loading editor...</p>
      </div>
    );
  }

  // Function to update a caption's properties
  const updateCaption = (id: string, updates: Partial<any>) => {
    setCaptions((prevCaptions) =>
      prevCaptions.map((cap) =>
        cap.id === id
          ? { ...cap, ...updates, style: { ...cap.style, ...updates.style } }
          : cap
      )
    );
  };

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-sky-blue-50">
          <Spinner className="w-10 h-10 text-primary" />
          <p className="ml-3 text-lg text-sky-blue-700">
            Loading editor assets...
          </p>
        </div>
      }
    >
      <div className="flex flex-col h-screen bg-sky-blue-50">
        {/* Top Bar for Export */}
        <div className="bg-white border-b border-border shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-sky-blue-800">Video Editor</h2>
          <ExportControls videoUrl={videoUrl} captions={captions} />
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Content Area: Video Canvas + Timeline */}
          <div className="flex flex-col flex-1 p-6 space-y-6 overflow-auto">
            {/* Video Canvas */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0 relative bg-black rounded-2xl overflow-hidden shadow-custom-lg aspect-video max-h-[60vh] mx-auto w-full"
            >
              <VideoCanvas videoUrl={videoUrl} captions={captions} />
            </motion.div>

            {/* Video Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 min-h-[150px] bg-white rounded-2xl shadow-custom-md p-4"
            >
              <VideoTimeline
                videoUrl={videoUrl}
                captions={captions}
                onSelectCaption={setSelectedCaption}
                selectedCaption={selectedCaption}
              />
            </motion.div>
          </div>

          {/* Right-hand side: Caption Editor Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-80 md:w-96 flex-shrink-0 bg-white border-l border-border shadow-custom-lg overflow-y-auto"
          >
            <CaptionPanel
              selectedCaption={selectedCaption}
              onUpdateCaption={updateCaption}
            />
          </motion.div>
        </div>
      </div>
    </Suspense>
  );
}
