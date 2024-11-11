// /app/viewer/SplatViewer.tsx
'use client';

import React, { useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats, PerspectiveCamera } from '@react-three/drei';
import { CameraController } from './CameraController';
import { ControlsUI } from './ControlsUI';
import { SceneSetup } from './SceneSetup';


interface SplatViewerProps {
  splatUrl: string;
  onClose: () => void;
}

export function SplatViewer({ splatUrl, onClose }: SplatViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  /* eslint-disable */
  // NOTE: Linting errors are suppressed for this callback reference.
  const controlsRef = useRef<any>(null);
  /* eslint-disable */

  const handleReset = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black z-50">
      <ControlsUI onReset={handleReset} onClose={onClose} />
      
      <Canvas>
        <Stats/>
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
        <SceneSetup splatUrl={splatUrl} />
      </Canvas>
    </div>
  );
}