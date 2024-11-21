// app/components/MasonryGrid.tsx
'use client';
import React, { useState, useEffect } from 'react';
import VideoItem from './VideoItem';
import { useRouter } from 'next/navigation';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
    const fetchVideoItems = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/fetchVideoItems');
        const data = await response.json();
        if (Array.isArray(data)) {
          const itemsWithSignedUrls = await Promise.all(data.map(async (item) => ({
            ...item,
            src: await getSignedS3Url(item.src),
            splatSrc: await getSignedS3Url(item.splatSrc)
          })));
          setVideoItems(itemsWithSignedUrls);
        } else {
          console.error('Unexpected API response format:', data);
        }
      } catch (error) {
        console.error("Error fetching video items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideoItems();
  }, []);

  const getSignedS3Url = async (s3Url: string) => {
    if (!s3Url) return null;
    
    const s3Client = new S3Client({
      region: process.env.NEXT_PUBLIC_AWS_REGION!,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
      },
    });

    let bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!;
    let objectKey = '';

    // Handle different URL formats
    if (s3Url.startsWith('s3://')) {
      const bucketAndKey = s3Url.substring(5); // Remove 's3://'
      const [bucket, ...keyParts] = bucketAndKey.split('/');
      bucketName = bucket;
      objectKey = keyParts.join('/');
    } else if (s3Url.startsWith('https://')) {
      // Handle full HTTPS URL
      const url = new URL(s3Url);
      bucketName = url.hostname.split('.')[0];
      objectKey = url.pathname.substring(1); // Remove leading '/'
    } else {
      // Handle plain object key
      objectKey = s3Url;
    }

    const command = new GetObjectCommand({ Bucket: bucketName, Key: objectKey });
    try {
      return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (error) {
      console.error("Error generating presigned URL:", error);
      return null;
    }
  };

  const handleVideoClick = async (item: SplatItem) => {
    console.log("Sending item:", item);
    if (item.splatSrc) {
      const url = `/viewer?${new URLSearchParams({
        splatUrl: item.splatSrc,
        description: item.description || '',
        name: item.name || '',
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