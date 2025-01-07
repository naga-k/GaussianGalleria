// src/app/components/VideoItem.tsx
import React, { useRef, useState, useEffect } from 'react';
import VideoItem from '../models/VideoItem';

interface VideoItemProps {
  item: VideoItem;
  onClick: (item: VideoItem) => void;
}

export default function VideoCard({ item, onClick }: VideoItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    const video = videoRef.current;
    if (video) {
      video.load();
    }
  }, []);

  // useEffect(() => {
  //   console.log('VideoItem received:', item);
  // });

  const handleVideoLoad = () => {
    setIsLoaded(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleVideoHover = (isHovering: boolean) => {
    const video = videoRef.current;
    if (!video || isMobile) return;
    if (isHovering) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (item.splatUrl) {
      onClick(item);
    }
  };

  return (
    <div 
      className="relative break-inside-avoid mb-4 cursor-pointer transform transition-transform hover:scale-105"
      onMouseEnter={() => handleVideoHover(true)}
      onMouseLeave={() => handleVideoHover(false)}
      onClick={handleClick}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}
      <video
        ref={videoRef}
        className={`w-full h-auto rounded-lg object-cover ${
          isLoaded ? 'block' : 'hidden'
        }`}
        onLoadedData={handleVideoLoad}
        src={item.src}
        playsInline
        muted
        loop
        preload="metadata"
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        style={{ maxHeight: '80vh' }}
      />
    </div>
  );
}