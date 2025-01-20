// src/app/components/MasonryGrid.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GalleryCard from "./GalleryCard";
import LoadSpinner from "./LoadSpinner";
import GalleryItem from "../lib/definitions/GalleryItem";

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
      <>
        <div className="flex items-center justify-center min-h-screen">
          <LoadSpinner />
        </div>
      </>
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
