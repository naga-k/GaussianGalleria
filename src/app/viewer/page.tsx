// app/viewer/page.tsx
"use client";
import React, { useEffect, Suspense } from "react";
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
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const splatUrl = searchParams.get("splatUrl");
  const description = searchParams.get("description");
  const name = searchParams.get("name");

  useEffect(() => {
    if (splatUrl) {
      console.log("Params received:", {
        id,
        splatUrl,
        description,
        name,
      });
    }
  }, [id, splatUrl, description, name]);

  const handleClose = () => {
    router.push("/");
  };

  return (
    <SplatViewer
      // splatUrl={splatUrl ? decodeURIComponent(splatUrl) : null}
      // description={description ? decodeURIComponent(description) : 'No description available'}
      // name={name ? decodeURIComponent(name) : 'Untitled'}
      id={id}
      onClose={handleClose}
    />
  );
};

export default Viewer;
