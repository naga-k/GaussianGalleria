'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Splat, Stats, PerspectiveCamera } from '@react-three/drei';

// Camera controls component with WASD and arrow key controls
function CameraController() {
  const { camera } = useThree();
  const keys = useRef<{ [key: string]: boolean }>({});
  const speed = useRef(0.1);
  const boost = useRef(1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
      if (e.key === 'Shift') boost.current = 2;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
      if (e.key === 'Shift') boost.current = 1;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    const currentSpeed = speed.current * boost.current;

    if (keys.current['w']) camera.translateZ(-currentSpeed);
    if (keys.current['s']) camera.translateZ(currentSpeed);
    if (keys.current['a']) camera.translateX(-currentSpeed);
    if (keys.current['d']) camera.translateX(currentSpeed);
    if (keys.current['q']) camera.translateY(currentSpeed);
    if (keys.current['e']) camera.translateY(-currentSpeed);
    
    if (keys.current['arrowup']) camera.rotateX(0.02);
    if (keys.current['arrowdown']) camera.rotateX(-0.02);
    if (keys.current['arrowleft']) camera.rotateY(0.02);
    if (keys.current['arrowright']) camera.rotateY(-0.02);
  });

  return null;
}

interface SplatViewerProps {
  splatUrl: string;
  onClose: () => void;
}

export function SplatViewer({ splatUrl, onClose }: SplatViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);

  const handleReset = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black z-50">
      <div className="absolute top-4 right-4 z-50 flex gap-4">
        <button 
          className="px-4 py-2 bg-white bg-opacity-10 text-white rounded hover:bg-opacity-20 transition-all"
          onClick={handleReset}
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

      <Canvas>
        <Stats />
        <PerspectiveCamera 
          makeDefault 
          position={[0, 0, 2]} 
          fov={75}
          near={0.1}
          far={1000}
        />
        <CameraController />
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={5}
          minDistance={0.5}
          maxPolarAngle={Math.PI * 0.75}
          minPolarAngle={Math.PI * 0.25}
          target={[0, 0, 0]}
        />
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 2, 2]} intensity={1} />
        <Splat src={splatUrl} />
      </Canvas>
    </div>
  );
}