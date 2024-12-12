// app/components/MasonryGrid.tsx
"use client";
import React, { useState, useEffect } from "react";
import VideoItem from "./VideoItem";
import { useRouter } from "next/navigation";
import { getSignedS3Url } from "../lib/cloud/s3";

interface SplatItem {
  id: number;
  name: string | null;
  splatSrc: string;
  src: string;
  description: string;
}

export default function MasonryGrid() {
  const [videoItems, setVideoItems] = useState<SplatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetchVideoItems()
      .then((items) => {
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

    return await Promise.all<Promise<SplatItem>>(
      data.map(async (item) => ({
        ...item,
        src: await getSignedS3Url(item.src),
        splatSrc: await getSignedS3Url(item.splatSrc),
      }))
    );
  };

  const handleVideoClick = async (item: SplatItem) => {
    console.log("Sending item:", item);
    if (item.splatSrc) {
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
          <VideoItem
            key={item.id}
            item={item}
            onClick={() => handleVideoClick(item)}
          />
        ))}
      </div>
    </div>
  );
}
