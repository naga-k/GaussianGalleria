// src/app/components/GalleryCard.tsx
interface GalleryItem {
    id: number;
    name: string;
    description: string | null;
  }
  
  interface Props {
    gallery: GalleryItem;
    onClick: () => void;
  }
  
  export default function GalleryCard({ gallery, onClick }: Props) {
    return (
      <div 
        onClick={onClick}
        className="bg-white rounded-lg shadow-lg p-6 cursor-pointer
                   hover:shadow-xl transition-shadow duration-300
                   transform hover:scale-105 transition-transform">
        <h2 className="text-2xl font-bold mb-2">{gallery.name}</h2>
        {gallery.description && (
          <p className="text-gray-600">{gallery.description}</p>
        )}
      </div>
    );
  }