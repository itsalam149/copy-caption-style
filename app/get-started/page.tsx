// app/get-started/page.tsx
"use client"; // This component uses client-side hooks like useState, so mark it.

import { useState } from "react";
import { useRouter } from "next/navigation"; // For navigation
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner"; // You'll create this minimal spinner
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function GetStartedPage() {
  const [reelLink, setReelLink] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize Next.js router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(null); // Clear previous errors

    if (!reelLink.trim()) {
      setError("Please provide an Instagram Reel link.");
      return;
    }
    if (!videoFile) {
      setError("Please upload a video file.");
      return;
    }

    setIsLoading(true);

    try {
      // In a real application, you would:
      // 1. Create a FormData object
      const formData = new FormData();
      formData.append("reelLink", reelLink);
      formData.append("videoFile", videoFile);

      // 2. Send it to your existing backend API
      // const response = await fetch('/api/process-video', { // Adjust endpoint as needed
      //   method: 'POST',
      //   body: formData,
      // });

      // 3. Handle the response
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Failed to process video.');
      // }
      // const data = await response.json();
      // const { videoUrl, assFileUrl } = data; // Assuming your backend returns these URLs

      // --- Simulation for demonstration ---
      console.log("Simulating backend processing...");
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate 3-second processing
      // For actual video, you'd get a *server-hosted* URL for the uploaded video
      const simulatedVideoUrl = `/temp-videos/${videoFile.name}`; // Example: point to a public temp dir
      const simulatedAssFileUrl = "/temp-subtitles/generated_subtitles.ass"; // Example: point to a public temp dir
      // In a real app, you'd store the actual uploaded file and generated ASS server-side
      // and pass their accessible URLs. For client-side, if the file remains client-side,
      // you could pass a Blob URL, but for persistence and re-rendering, server URLs are better.
      // For now, these are illustrative paths.
      // --- End Simulation ---

      // Navigate to the editor page, passing the video and ASS file URLs as query parameters
      // Or, ideally, store them in a state management solution (e.g., Zustand, Context) or server-side store
      router.push(
        `/editor?videoUrl=${encodeURIComponent(
          simulatedVideoUrl
        )}&assUrl=${encodeURIComponent(simulatedAssFileUrl)}`
      );
    } catch (err: any) {
      console.error("Processing error:", err);
      setError(
        err.message ||
          "An unexpected error occurred during processing. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-sky-blue-50">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-sky-blue-800">
              Get Started with Caption-AI
            </CardTitle>
            <CardDescription className="text-center">
              Paste your Instagram Reel link and upload the video you want to
              style.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="reel-link"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Instagram Reel Link
                </label>
                <Input
                  type="url"
                  id="reel-link"
                  placeholder="e.g., https://www.instagram.com/reel/abcdef123"
                  value={reelLink}
                  onChange={(e) => setReelLink(e.target.value)}
                  required
                  className="rounded-lg border-border focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label
                  htmlFor="video-file"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Upload Your Video (.mp4)
                </label>
                <Input
                  type="file"
                  id="video-file"
                  accept=".mp4"
                  onChange={(e) =>
                    setVideoFile(e.target.files ? e.target.files[0] : null)
                  }
                  required
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-sky-blue-100 file:text-sky-blue-700
                    hover:file:bg-sky-blue-200 cursor-pointer"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-md border border-red-200"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                className={cn(
                  "w-full py-3 text-lg rounded-xl flex items-center justify-center space-x-2",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
                disabled={isLoading}
              >
                {isLoading && <Spinner className="w-5 h-5" />}
                <span>{isLoading ? "Processing..." : "Process Video"}</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
