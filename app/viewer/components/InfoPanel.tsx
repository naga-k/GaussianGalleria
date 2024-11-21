// app/viewer/components/InfoPanel.tsx
import { X } from 'lucide-react';

interface InfoPanelProps {
  description: string;
  name: string;
  isOpen: boolean;
  onClose: () => void;
}

export function InfoPanel({ description, name, isOpen, onClose }: InfoPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 p-6 rounded-lg max-w-md w-full backdrop-blur-sm z-50">
      <h2 className="text-xl font-bold text-white mb-2">{name}</h2>
      <p className="text-gray-200">{description}</p>
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-white/60 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}