"use client";  // Add this directive at the top

import * as React from 'react';
import { useEffect } from 'react';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

const ViewerComponent = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize GaussianSplats3D viewer
      const viewer = new GaussianSplats3D.Viewer({
        'cameraUp': [0, -1, -0.6],
        'initialCameraPosition': [-1, -4, 6],
        'initialCameraLookAt': [0, 4, 0],
        'gpuAcceleratedSort': true
      });

      viewer.addSplatScene('', {
        'splatAlphaRemovalThreshold': 5,
        'showLoadingUI': true,
        'position': [0, 1, 0],
        'rotation': [0, 0, 0, 1],
        'scale': [1.5, 1.5, 1.5]
      }).then(() => {
        viewer.start();
      });
    }
  }, []); // Empty dependency array means this runs once on mount

  return <div id="viewer-container" />;
};

export default ViewerComponent;