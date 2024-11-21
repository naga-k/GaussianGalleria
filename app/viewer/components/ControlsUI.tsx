import { X, RotateCcw, Info } from 'lucide-react';

interface ControlsUIProps {
  onReset: () => void;
  onClose: () => void;
  onInfoClick: () => void;
}

export function ControlsUI({ onReset, onClose, onInfoClick }: ControlsUIProps) {
  return (
    <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
      <button
        onClick={onInfoClick}
        className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm"
        title="Show Info"
      >
        <Info className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={onReset}
        className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm"
        title="Reset View"
      >
        <RotateCcw className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={onClose}
        className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm"
        title="Close"
      >
        <X className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}