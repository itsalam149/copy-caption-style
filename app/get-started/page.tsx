"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Upload, Link as LinkIcon, Loader2 } from "lucide-react";

// Store data in a simple client-side cache to pass to the editor page
const editorDataStore = {
  assText: "",
  videoUrl: "",
};

export default function GetStartedPage() {
  const router = useRouter();
  const [reelLink, setReelLink] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelLink || !videoFile) {
      alert("Please provide both a Reel link and a video file.");
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append("reelLink", reelLink);
    formData.append("videoFile", videoFile);

    try {
      // IMPORTANT: Replace with your actual backend URL
      const response = await fetch(
        "https://your-backend-url.com/process-video",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      // Assume the backend returns the .ass file content as plain text
      const assText = await response.text();

      // Store data and navigate
      editorDataStore.assText = assText;
      editorDataStore.videoUrl = URL.createObjectURL(videoFile);

      router.push("/editor");
    } catch (error) {
      console.error("Failed to process video:", error);
      alert("An error occurred. Please check the console for more details.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader>
          <CardTitle>Create Your Video</CardTitle>
          <CardDescription>
            Provide a Reel link and your video to start editing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="reel-link">Instagram Reel Link</label>
              <div className="flex items-center relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="reel-link"
                  type="url"
                  placeholder="https://www.instagram.com/reels/..."
                  value={reelLink}
                  onChange={(e) => setReelLink(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="video-file">Your Landscape Video (.mp4)</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                  <Upload className="w-8 h-8 mb-2" />
                  <p className="text-sm text-center">
                    {videoFile
                      ? videoFile.name
                      : "Click to upload or drag and drop"}
                  </p>
                </div>
                <Input
                  id="video-file"
                  type="file"
                  className="hidden"
                  accept="video/mp4"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  required
                />
              </label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Generate Captions"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      {/* We need a place to export our data store for the editor page to import */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.editorDataStore = ${JSON.stringify(editorDataStore)}`,
        }}
      />
    </div>
  );
}

// Export the data store so the editor page can access it
export { editorDataStore };
