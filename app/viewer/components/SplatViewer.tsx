// /app/viewer/components/SplatViewer.tsx
'use client';

import React, { useRef, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats, PerspectiveCamera } from '@react-three/drei';
import { CameraController } from './CameraController';
import { ControlsUI } from './ControlsUI';
import { SceneSetup } from './SceneSetup';
import { CameraInfo } from './CameraInfo';
import * as THREE from 'three'; // Import Three.js

interface SplatViewerProps {
  splatUrl: string;
  onClose: () => void;
}

export default function SplatViewer({ splatUrl, onClose }: SplatViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  /* eslint-disable */
  // NOTE: Linting errors are suppressed for this callback reference.
  const controlsRef = useRef<any>(null);
  /* eslint-enable */

  const handleReset = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  // Create GridHelper using useMemo to prevent re-creation on every render
  const gridHelper = useMemo(() => new THREE.GridHelper(100, 100, 'white', 'gray'), []);

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black z-50">
      <ControlsUI onReset={handleReset} onClose={onClose} />

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
        <SceneSetup splatUrl={splatUrl} />

        {/* Add GridHelper */}
        <primitive object={gridHelper} />

        {/* Add CameraInfo inside Canvas using Html */}
        <CameraInfo />
      </Canvas>
    </div>
  );
}