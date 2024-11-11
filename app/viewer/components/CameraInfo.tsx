// app/viewer/components/CameraInfo.tsx
import { useThree, useFrame } from '@react-three/fiber';
import React, { useState } from 'react';
import { Html } from '@react-three/drei';

export function CameraInfo() {
  const { camera } = useThree();
  const [info, setInfo] = useState({
    position: camera.position.clone(),
    rotation: camera.rotation.clone(),
  });

  useFrame(() => {
    setInfo({
      position: camera.position.clone(),
      rotation: camera.rotation.clone(),
    });
  });

  return (
    <Html>
    <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 p-2 rounded">
      <p>
        Position: x: {info.position.x.toFixed(2)}, y: {info.position.y.toFixed(2)}, z: {info.position.z.toFixed(2)}
      </p>
      {/* <p>
        Rotation: x: {info.rotation.x.toFixed(2)}, y: {info.rotation.y.toFixed(2)}, z: {info.rotation.z.toFixed(2)}
      </p> */}
    </div>
    </Html>
  );
}