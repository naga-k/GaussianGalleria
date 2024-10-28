// app/components/MasonryGrid.tsx
'use client';
import React, { useState, useEffect } from 'react';
import VideoItem from './VideoItem';
import { SplatViewer } from '../viewer/SplatViewer';
import { useRouter } from 'next/navigation';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface VideoItem {
  src: string;
  splatSrc: string;
}

const MasonryGrid: React.FC = () => {
  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSplat, setSelectedSplat] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchVideoItems = async () => {
      try {
        const response = await fetch('/api/fetchVideoItems');
        const data = await response.json();
        if (Array.isArray(data)) {
          const itemsWithSignedUrls = await Promise.all(data.map(async (item) => ({
            ...item,
            src: await getSignedS3Url(item.src),
          })));
          setVideoItems(itemsWithSignedUrls);
        } else {
          console.error('Unexpected API response format:', data);
        }
      } catch (error) {
        console.error("Error fetching video items:", error);
      }
    };
    fetchVideoItems();
  }, []);

  const getSignedS3Url = async (s3Url: string) => {
    const s3Client = new S3Client({
      region: process.env.NEXT_PUBLIC_AWS_REGION!,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
      },
    });
    // Extract bucket and key from the s3Url
    const [bucketName, ...keyParts] = s3Url.replace("s3://", "").split("/");
    const objectKey = keyParts.join("/");
    const command = new GetObjectCommand({ Bucket: bucketName, Key: objectKey });
    try {
      return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (error) {
      console.error("Error generating presigned URL:", error);
      return null; // Return null or handle the error as needed
    }
  };

  const handleVideoClick = async (item: VideoItem) => {
    try {
      const signedSplatSrc = await getSignedS3Url(item.splatSrc);
      setSelectedSplat(signedSplatSrc);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error signing splatSrc:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSplat(null);
    router.push('');
  };

  return (
    <div className='relative'>
      <div className='columns-1 sm:columns-2 lg:columns-3 py-10 md:py-20 gap-4'>
        {videoItems.map((item, index) => (
          <VideoItem
            key={index}
            item={item}
            onClick={() => handleVideoClick(item)}
          />
        ))}
      </div>
      {isModalOpen && selectedSplat && (
        <SplatViewer splatUrl={selectedSplat} onClose={closeModal} />
      )}
    </div>
  );
};

export default MasonryGrid;