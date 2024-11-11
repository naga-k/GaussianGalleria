// app/components/MasonryGrid.tsx
'use client';
import React, { useState, useEffect } from 'react';
import VideoItem from './VideoItem';
import { useRouter } from 'next/navigation';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface VideoItem {
  src: string;
  splatSrc: string;
}

const MasonryGrid: React.FC = () => {
  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
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

    let bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!;
    let objectKey = '';

    if (s3Url.startsWith('s3://')) {
      // Handle s3://bucket/key
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

  const handleVideoClick = async (item: VideoItem) => {
    try {
      const signedSplatSrc = await getSignedS3Url(item.splatSrc);
      console.log("Splat url that is in the db", item.splatSrc);
      if (signedSplatSrc) {
        router.push(`/viewer?splatUrl=${encodeURIComponent(signedSplatSrc)}`);
      }
    } catch (error) {
      console.error("Error signing splatSrc:", error);
    }
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
    </div>
  );
};

export default MasonryGrid;