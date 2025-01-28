// src/app/gallery/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import VideoCard from "../../../components/VideoCard";
import VideoItem from "../../../lib/definitions/VideoItem";
import { useRouter } from "next/navigation";
import LoadSpinner from "../../../components/LoadSpinner";
import Header from "@/src/app/components/Header";
import { GalleryDetails } from "@/src/app/lib/definitions/GalleryItem";


export default function GalleryPage({ params }: { params: { id: string } }) {
  const [splats, setSplats] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryDetails, setGalleryDetails] = useState<GalleryDetails | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    fetchGalleryDetails(params.id);
    fetchGallerySplats(params.id);
  }, [params.id]);

  const fetchGalleryDetails = async (galleryId: string) => {
    try {
      const response = await fetch(
        `/api/galleries/gallery/${galleryId}/fetchDetails`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGalleryDetails(data);
    } catch (err) {
      console.error("Error fetching gallery details:", err);
    }
  };

  const fetchGallerySplats = async (galleryId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/galleries/gallery/${galleryId}/splats`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Data is not an array");
      }

      // Extract URLs to sign
      const urlsToSign = data.map((item) => item.src).filter(Boolean);

      // Sign all URLs in one request
      const signedResponse = await fetch("/api/s3-presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: urlsToSign }),
      });

      const { signedUrls } = await signedResponse.json();

      // Create URL mapping
      const urlMap = new Map(urlsToSign.map((url, i) => [url, signedUrls[i]]));

      // Update items with signed URLs
      const signedSplats = data.map((item) => ({
        ...item,
        src: urlMap.get(item.src) || item.src,
      }));

      setSplats(signedSplats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (item: VideoItem) => {
    if (item.splatUrl) {
      router.push(
        `/viewer?${new URLSearchParams({
          id: item.id.toString(),
        })}`
      );
    }
  };

  const BackDiv = () => {
    return (
      <>
        <div
          className="mt-8 hover:text-teal-600 hover:cursor-pointer"
          onClick={() => router.push("/")}
        >
          <p>&#8592; Back to Gallery</p>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Error: {error}</div>;
  }

  if (!splats.length) {
    return (
      <div className="m-8 flex flex-col">
        <BackDiv />
        <div className="text-center">No splats found in this gallery.</div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto scrollbar-hide">
      <Header
        title={galleryDetails?.name || "Loading..."}
        subtitle={galleryDetails?.description || null}
      />

      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <BackDiv />
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 py-10 [&>div]:mb-4">
          {splats.map((splat) => (
            <VideoCard
              key={splat.id}
              item={splat}
              onClick={() => handleVideoClick(splat)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
