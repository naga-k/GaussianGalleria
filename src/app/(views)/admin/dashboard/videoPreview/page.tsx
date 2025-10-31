"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthContainer from "../../components/AuthContainer";

interface VideoData {
  id: number;
  name: string;
  videoUrl: string | null; // server will now return signed URL
}

function VideoPreview() {
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/fetchSceneDetailsWithID?id=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch video details");
        }
        const data: VideoData = await response.json();
        // Server should return the signed HTTPS URL already.
        setVideoUrl(data.videoUrl ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVideo();
  }, [id]);

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
      {loading ? (
        <div className="text-white">Loading video...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : videoUrl ? (
        <video
          className="max-w-[90%] max-h-[90vh]"
          controls
          autoPlay
          src={videoUrl}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="text-white">No video found</div>
      )}
    </div>
  );
}

export default function VideoPreviewPage() {
  const router = useRouter();

  return (
    <AuthContainer fallback={() => { router.push("/admin"); }}>
      <VideoPreview />
    </AuthContainer>
  );
}