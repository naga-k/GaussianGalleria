// src/app/components/MasonryGrid.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GalleryCard from "./GalleryCard";

interface GalleryItem {
  id: number;
  name: string;
  description: string | null;
}

export default function MasonryGrid() {
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetchGalleries()
      .then((items: GalleryItem[]) => {
        setGalleries(items);
      })
      .catch((error) => {
        console.error("Error fetching galleries:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const fetchGalleries = async () => {
    const response = await fetch("/api/galleries/fetchGalleries");
    const data = await response.json();
    return data;
  };

  const handleGalleryClick = (galleryId: number) => {
    router.push(`/gallery/${galleryId}/`);
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
        {galleries.map((gallery) => (
          <GalleryCard
            key={gallery.id}
            gallery={gallery}
            onClick={() => handleGalleryClick(gallery.id)}
          />
        ))}
      </div>
    </div>
  );
}