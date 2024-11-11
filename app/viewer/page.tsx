// app/viewer/page.tsx
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SplatViewer from './components/SplatViewer';

const Viewer: React.FC = () => {
  const searchParams = useSearchParams();
  const splatUrl = searchParams.get('splatUrl');
  const [url, setUrl] = useState<string | null>(null);
  const router = useRouter();

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

  return (
    <Suspense fallback={<div>Loading...</div>}>
<SplatViewer splatUrl={url} onClose={handleClose} />
    </Suspense>
  );
};

export default Viewer;