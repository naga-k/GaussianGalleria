// app/page.tsx
'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text, Center, OrbitControls } from '@react-three/drei';
import MasonryGrid from './components/MasonryGrid';

export default function Home() {
  return (
    <div className="overflow-y-auto scrollbar-hide">
      <div className="h-[30vh] w-full bg-gradient-to-b from-slate-900 to-slate-800">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <Center>
              <Text
                fontSize={1.5}
                maxWidth={10}
                lineHeight={1}
                letterSpacing={0.05}
                textAlign={'center'}
              >
                DiffStudio 3D Gallery
                <meshPhongMaterial 
                  attach="material"
                  color="#fff"
                  emissive="#304050"
                  shininess={50}
                />
              </Text>
            </Center>
          </Suspense>
        </Canvas>
      </div>
      <MasonryGrid />
    </div>
  );
}
