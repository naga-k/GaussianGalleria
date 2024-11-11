// app/pages/splatViewer.tsx
'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { SplatViewer } from './components/SplatViewer';

const SplatViewerPage: React.FC = () => {
  const searchParams = useSearchParams();
  const splatUrl = searchParams.get('splatUrl');

  if (!splatUrl) {
    return <div>Invalid Splat URL</div>;
  }

  const handleClose = () => {
    window.history.back();
  };

  return <SplatViewer splatUrl={splatUrl} onClose={handleClose} />;
};

export default SplatViewerPage;