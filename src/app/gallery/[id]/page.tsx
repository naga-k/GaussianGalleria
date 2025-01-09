// src/app/gallery/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import VideoCard from '../../components/VideoCard';
import VideoItem from '../../models/VideoItem';
import { useRouter } from 'next/navigation';

interface GalleryDetails {
  name: string;
  description: string | null;
}

export default function GalleryPage({ params }: { params: { id: string } }) {
  const [splats, setSplats] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryDetails, setGalleryDetails] = useState<GalleryDetails | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchGalleryDetails(params.id);
    fetchGallerySplats(params.id);
  }, [params.id]);

  const fetchGalleryDetails = async (galleryId: string) => {
    try {
      const response = await fetch(`/api/galleries/gallery/${galleryId}/fetchDetails`);
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
      const response = await fetch(`/api/galleries/gallery/${galleryId}/splats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Received data:", data);
      
      if (!Array.isArray(data)) {
        throw new Error('Data is not an array');
      }

      // Extract URLs to sign
      const urlsToSign = data.map(item => item.src).filter(Boolean);

      // Sign all URLs in one request
      const signedResponse = await fetch("/api/s3-presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: urlsToSign }),
      });

      const { signedUrls } = await signedResponse.json();

      // Create URL mapping
      const urlMap = new Map(urlsToSign.map((url, i) => [url, signedUrls[i]]));

      console.log("Url Maps below");
      console.log(urlMap);

      // Update items with signed URLs
      const signedSplats = data.map(item => ({
        ...item,
        src: urlMap.get(item.src) || item.src,
      }));
      
      setSplats(signedSplats);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (item: VideoItem) => {
    if (item.splatUrl) {
      router.push(`/viewer?${new URLSearchParams({
        id: item.id.toString(),
      })}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error: {error}
      </div>
    );
  }

  if (!splats.length) {
    return (
      <div className="text-center p-4">
        No splats found in this gallery
      </div>
    );
  }

  console.log("Splats")
  console.log(splats)

  return (
    <div className="overflow-y-auto scrollbar-hide">
      <header className="bg-gradient-to-r from-gray-900 to-black text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-center text-white 
                  hover:text-teal-400 
                  transition-colors duration-300 
                  shadow-lg 
                  transform hover:scale-105 
                  transition-transform duration-500">
            {galleryDetails?.name || 'Loading...'}
          </h1>
          {galleryDetails?.description && (
            <p className="mt-4 text-xl text-center text-gray-300 
                       hover:text-teal-300 
                       transition-colors duration-300">
              {galleryDetails.description}
            </p>
          )}
        </div>
      </header>
      
      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 py-10 md:py-20 [&>div]:mb-4">
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