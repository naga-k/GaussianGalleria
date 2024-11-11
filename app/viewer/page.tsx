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

const ViewerContent: React.FC<{ router: ReturnType<typeof useRouter> }> = ({ router }) => {
  const searchParams = useSearchParams();
  const splatUrl = searchParams.get('splatUrl');
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (splatUrl) {
      setUrl(splatUrl);
      console.log('Splat URL:', splatUrl);
    } else {
      setUrl(null);
    }
  }, [splatUrl]);

  const handleClose = () => {
    router.push('/');
  };

  return <SplatViewer splatUrl={url} onClose={handleClose} />;
};

export default Viewer;