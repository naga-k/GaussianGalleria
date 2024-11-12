// app/components/VideoItem.tsx
import React, { useRef } from 'react';

export interface VideoItem {
  src: string;
  splatSrc: string;
}

interface VideoItemProps {
  item: VideoItem;
  onClick: (splatSrc: string) => void;
}

const VideoItem: React.FC<VideoItemProps> = ({ item, onClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoHover = (isHovering: boolean) => {
    const video = videoRef.current;
    if (video) {
      if (isHovering) {
        video.play();
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  };

  return (
    <div className='mb-4 break-inside-avoid'>
      <video
        ref={videoRef}
        src={item.src}
        className='w-full h-auto object-cover rounded-lg cursor-pointer'
        onMouseEnter={() => handleVideoHover(true)}
        onMouseLeave={() => handleVideoHover(false)}
        onClick={() => onClick(item.splatSrc)}
        playsInline
        preload='metadata'
        disablePictureInPicture
      />
    </div>
  );
};

export default VideoItem;