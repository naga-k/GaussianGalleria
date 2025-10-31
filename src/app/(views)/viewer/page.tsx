// app/viewer/page.tsx
"use client";
import React, { useEffect, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import SplatViewer from "./components/SplatViewer";

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
  const [sceneItem, setSceneItem] = useState<{
    id: number;
    name: string;
    description: string;
    splatUrl: string;
    videoUrl: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

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

    // API returns object with splatUrl/videoUrl (signed URLs)
    return await response.json();
  };

  useEffect(() => {
    setLoading(true);
    fetchSceneItem(id)
      .then((responseData) => { // Remove SceneItem type here
        setSceneItem(responseData);
      })
      .catch((error) => {
        console.error("Error fetching scene items:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleClose = () => {
    router.back();
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
