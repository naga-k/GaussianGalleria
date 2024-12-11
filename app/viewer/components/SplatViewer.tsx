// app/viewer/components/SplatViewer.tsx
'use client';
import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats, PerspectiveCamera, Html } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CameraController } from './CameraController';
import { ControlsUI } from './ControlsUI';
import { SceneSetup } from './SceneSetup';
import * as THREE from 'three'; 
import { ErrorBoundary } from 'react-error-boundary';
import { InfoPanel } from './InfoPanel';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface SplatViewerProps {
  onClose: () => void;
  id?: number;
}

interface SceneItem {
  id: number;
  name: string | null;
  description: string | null;
  splatUrl: string | null;
}

export default function SplatViewer({ 
  onClose,
  id = 1,
}: SplatViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  // const [loading, setLoading] = useState(false); // For future use
  const [sceneItem, setSceneItem] = useState<SceneItem[]>([]);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const fetchSceneItem = async () => {
      // setLoading(true);
      try {
        const response = await fetch(`api/fetchSceneDetailsWithID?${new URLSearchParams({
          id: id.toString(),
        }).toString()}`);
        const sceneItem: SceneItem = await response.json().then(async (item) => {
          return {
            id: item.id,
            name: item.name,
            description: item.description,
            splatUrl: await getSignedS3Url(item.splatSrc)
          }
        });
        setSceneItem([sceneItem]);
      } catch (error) {
        console.error("Error fetching scene items:", error);
      } finally {
        // setLoading(false);
      }
    };
    fetchSceneItem();
  }, []);

  const getSignedS3Url = async (s3Url: string) => {
    if (!s3Url) return null;
    
    const s3Client = new S3Client({
      region: process.env.NEXT_PUBLIC_AWS_REGION!,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
      },
    });

    let bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!;
    let objectKey = '';

    // Handle different URL formats
    if (s3Url.startsWith('s3://')) {
      const bucketAndKey = s3Url.substring(5); // Remove 's3://'
      const [bucket, ...keyParts] = bucketAndKey.split('/');
      bucketName = bucket;
      objectKey = keyParts.join('/');
    } else if (s3Url.startsWith('https://')) {
      // Handle full HTTPS URL
      const url = new URL(s3Url);
      bucketName = url.hostname.split('.')[0];
      objectKey = url.pathname.substring(1); // Remove leading '/'
    } else {
      // Handle plain object key
      objectKey = s3Url;
    }

    const command = new GetObjectCommand({ Bucket: bucketName, Key: objectKey });
    try {
      return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (error) {
      console.error("Error generating presigned URL:", error);
      return null;
    }
  };

  const handleReset = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  // Create GridHelper using useMemo to prevent re-creation on every render
  const gridHelper = useMemo(() => new THREE.GridHelper(100, 100, 'white', 'gray'), []);

  if (!sceneItem.length || !sceneItem[0].splatUrl) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <p>No Splat to display.</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black z-50">
      <ControlsUI 
        onReset={handleReset} 
        onClose={onClose} 
        onInfoClick={() => setShowInfo(true)}
      />
      <InfoPanel 
        description={sceneItem[0].description ||  ''}
        name={sceneItem[0].name || ''}
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
      />
      <Canvas>
        <ErrorBoundary 
          fallback={
            <Html center>
              <div className="text-center">
                <p className="text-red-500">Failed to load Splat</p>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                  Go Home
                </button>
              </div>
            </Html>
          }
        >
          <Stats />
          <PerspectiveCamera makeDefault position={[0.40, 0.08, -0.42]} fov={75} near={0.1} far={1000} />
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
          <SceneSetup splatUrl={sceneItem[0].splatUrl || ''} />
          <primitive object={gridHelper} />
        </ErrorBoundary>
      </Canvas>
    </div>
  );
}