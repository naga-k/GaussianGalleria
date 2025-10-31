// src/app/components/GalleryCard.tsx

import Image from "next/image";
import {GalleryItem} from "../lib/definitions/GalleryItem";

interface Props {
  gallery: GalleryItem;
  onClick: () => void;
}

export default function GalleryCard({ gallery, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="rounded-lg shadow-lg overflow-hidden cursor-pointer
                     hover:shadow-xl transition-shadow duration-300
                     transform hover:scale-105 transition-transform"
    >
      {gallery.thumbnailKey && (
        <div className="w-full h-48 relative">
          <Image
            src={gallery.thumbnailKey}
            alt={gallery.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h2 className="text-xl font-bold">{gallery.name}</h2>
      </div>
    </div>
  );
}
