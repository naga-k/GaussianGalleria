// app/viewer/page.tsx
"use client";
import React, { useEffect, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import SplatViewer from "./components/SplatViewer";
import SceneItem from "../models/SceneItem";

const Viewer: React.FC = () => {
  const router = useRouter();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewerContent router={router} />
    </Suspense>
  );
};

interface ViewerContentProps {
  router: AppRouterInstance;
}

const ViewerContent: React.FC<ViewerContentProps> = ({ router }) => {
  const [loading, setLoading] = useState(true); // For future use
  const [sceneItem, setSceneItem] = useState<SceneItem | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    setLoading(true);
    fetchSceneItem(id)
      .then((sceneItem: SceneItem) => {
        setSceneItem(sceneItem);
      })
      .catch((error) => {
        console.error("Error fetching scene items:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const fetchSceneItem = async (id: string | null) => {
    if (!id) {
      throw new Error("Viewer - Param not provided: 'id'");
    }

    const response = await fetch(
      `api/fetchSceneDetailsWithID?${new URLSearchParams({
        id: id,
      }).toString()}`
    );

    if (!response.ok) {
      throw new Error(
        `${response.status}: ${await response.json().then((body) => body.error)}`
      );
    }

    const item = await response.json();

    // Sign the URL using the API
    const signedResponse = await fetch('/api/s3-presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls: [item.splatUrl] })
    });

    const { signedUrls } = await signedResponse.json();
    
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      splatUrl: signedUrls[0], // Get the first (and only) signed URL
    };
  };

  const handleClose = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <p>Fetching Splat....</p>
        </div>
      </div>
    );
  }

  return <SplatViewer sceneItem={sceneItem} onClose={handleClose} />;
};

export default Viewer;
