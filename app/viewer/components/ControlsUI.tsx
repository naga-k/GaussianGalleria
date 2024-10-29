interface ControlsUIProps {
  onReset: () => void;
  onClose: () => void;
}

export function ControlsUI({ onReset, onClose }: ControlsUIProps) {
  return (
    <>
      <div className="absolute top-4 right-4 z-50 flex gap-4">
        <button 
          className="px-4 py-2 bg-white bg-opacity-10 text-white rounded hover:bg-opacity-20 transition-all"
          onClick={onReset}
        >
          Reset View
        </button>
        <button 
          className="px-4 py-2 bg-white bg-opacity-10 text-white rounded hover:bg-opacity-20 transition-all"
          onClick={onClose}
        >
          Close
        </button>
      </div>
      
      <div className="absolute bottom-4 left-4 text-white text-sm bg-black bg-opacity-50 p-4 rounded">
        <p>WASD - Move camera</p>
        <p>Q/E - Up/Down</p>
        <p>Arrow Keys - Rotate</p>
        <p>Hold Shift - Speed boost</p>
        <p>Mouse - Orbit/Zoom</p>
      </div>
    </>
  );
}
