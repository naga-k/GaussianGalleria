// app/viewer/page.tsx
"use client";
import React, { useEffect, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import SplatViewer from "./components/SplatViewer";
import SceneItem from "./models/SceneItem";
import { getSignedS3Url } from "../lib/cloud/s3";

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
      .then((sceneItem) => {
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
        `${response.status}: ${await response.json().then((body) => {
          return body.error;
        })}`
      );
    }

    return await response.json().then(async (item) => {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        splatUrl: await getSignedS3Url(item.splatSrc),
      };
    });
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
