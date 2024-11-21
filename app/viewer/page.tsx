// app/viewer/page.tsx
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SplatViewer from './components/SplatViewer';

const Viewer: React.FC = () => {
  const router = useRouter();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewerContent router={router} />
    </Suspense>
  );
};

const ViewerContent = ({ router }) => {
  const searchParams = useSearchParams();
  const splatUrl = searchParams.get('splatUrl');
  const description = searchParams.get('description');
  const name = searchParams.get('name');

  useEffect(() => {
    console.log("Params received:", { splatUrl, description, name }); // Debug log
  }, [splatUrl, description, name]);

  return (
    <SplatViewer 
      splatUrl={splatUrl ? decodeURIComponent(splatUrl) : null}
      description={description ? decodeURIComponent(description) : 'No description available'}
      name={name ? decodeURIComponent(name) : 'Untitled'}
      onClose={() => router.push('/')}
    />
  );
};

export default Viewer;