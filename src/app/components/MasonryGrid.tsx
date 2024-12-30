// app/components/MasonryGrid.tsx
"use client";
import React, { useState, useEffect } from "react";
import VideoItem from "../lib/definitions/VideoItem";
import VideoCard from "./VideoCard";
import { useRouter } from "next/navigation";

export default function MasonryGrid() {
  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetchVideoItems()
      .then((items: VideoItem[]) => {
        setVideoItems(items);
      })
      .catch((error) => {
        console.error("Error fetching video items:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const fetchVideoItems = async () => {
    const response = await fetch("/api/fetchVideoItems");
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error(`Unexpected API response format: ${data}`);
    }

    // Only collect src URLs
    const urlsToSign = data.map(item => item.src).filter(Boolean);

    // Sign all URLs in one request
    const signedResponse = await fetch('/api/s3-presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls: urlsToSign })
    });
    
    const { signedUrls } = await signedResponse.json();
    
    // Create a map for src URLs only
    const urlMap = new Map(urlsToSign.map((url, i) => [url, signedUrls[i]]));

    // Map the signed src URLs back to items
    return data.map(item => ({
      ...item,
      src: urlMap.get(item.src),
    }));
  };

  const handleVideoClick = async (item: VideoItem) => {
    console.log("Sending item:", item);
    if (item.splatUrl) {
      const url = `/viewer?${new URLSearchParams({
        id: item.id.toString(),
      })}`;
      console.log("Navigation URL:", url);
      router.push(url);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full px-4 sm:px-6 lg:px-8">
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 py-10 md:py-20 [&>div]:mb-4">
        {videoItems.map((item) => (
          <VideoCard
            key={item.id}
            item={item}
            onClick={() => handleVideoClick(item)}
          />
        ))}
      </div>
    </div>
  );
}
