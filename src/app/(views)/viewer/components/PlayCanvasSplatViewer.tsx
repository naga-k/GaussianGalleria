"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Application, Entity as EntityComponent } from "@playcanvas/react";
import { Camera, GSplat } from "@playcanvas/react/components";
import { useApp, useSplat } from "@playcanvas/react/hooks";
import { OrbitControls } from "@playcanvas/react/scripts";
import { Mouse, TouchDevice, Vec3 } from "playcanvas";
import type { Entity as PcEntity, ScriptComponent } from "playcanvas";

interface PlayCanvasSplatViewerProps {
  src: string;
  onResetReady?: (resetFn: (() => void) | null) => void;
}

export const PlayCanvasSplatViewer = memo(function PlayCanvasSplatViewer({
  src,
  onResetReady,
}: PlayCanvasSplatViewerProps) {
  const defaultFocus = useMemo(() => new Vec3(0, 0, 0), []);
  const defaultPosition = useMemo(() => new Vec3(0, 0, 2.5), []);

  return (
    <div className="absolute inset-0">
      <Application
        graphicsDeviceOptions={{ antialias: false }}
        style={{ width: "100%", height: "100%" }}
      >
        <PlayCanvasScene
          src={src}
          defaultFocus={defaultFocus}
          defaultPosition={defaultPosition}
          onResetReady={onResetReady}
        />
      </Application>
    </div>
  );
});

interface PlayCanvasSceneProps {
  src: string;
  defaultFocus: Vec3;
  defaultPosition: Vec3;
  onResetReady?: (resetFn: (() => void) | null) => void;
}

function PlayCanvasScene({
  src,
  defaultFocus,
  defaultPosition,
  onResetReady,
}: PlayCanvasSceneProps) {
  const app = useApp();
  const [cameraEntity, setCameraEntity] = useState<PcEntity | null>(null);
  const orbitCameraRef = useRef<OrbitCameraScript | null>(null);

  useEffect(() => {
    if (!app) {
      return;
    }

    const canvas = app.graphicsDevice?.canvas;
    if (!canvas) {
      return;
    }

    if (!app.mouse) {
      app.mouse = new Mouse(canvas);
    }

    if (!app.touch) {
      app.touch = new TouchDevice(canvas);
    }
  }, [app]);

  useEffect(() => {
    if (!cameraEntity?.script) {
      return;
    }

    const scriptComponent = cameraEntity.script as ScriptComponentWithOrbit;

    const registerOrbitCamera = (scriptInstance: OrbitCameraScript) => {
      orbitCameraRef.current = scriptInstance;

      if (!onResetReady) {
        return;
      }

      onResetReady(() => {
        if (!orbitCameraRef.current) {
          return;
        }

        const focus = defaultFocus.clone();
        const position = defaultPosition.clone();

        orbitCameraRef.current.resetAndLookAtPoint(position, focus);
      });
    };

    const existingOrbitCamera = scriptComponent.orbitCamera;
    if (existingOrbitCamera) {
      registerOrbitCamera(existingOrbitCamera);
    }

    scriptComponent.on("create:orbitCamera", registerOrbitCamera);

    return () => {
      scriptComponent.off("create:orbitCamera", registerOrbitCamera);
      orbitCameraRef.current = null;
      onResetReady?.(null);
    };
  }, [cameraEntity, defaultFocus, defaultPosition, onResetReady]);

  return (
    <>
      <EntityComponent
        ref={setCameraEntity}
        position={[defaultPosition.x, defaultPosition.y, defaultPosition.z]}
      >
        <Camera fov={60} />
        <OrbitControls
          frameOnStart={false}
          distanceMin={0.5}
          distanceMax={5}
          distance={2.5}
          pivotPoint={defaultFocus}
          mouse={{ orbitSensitivity: 0.3, distanceSensitivity: 0.15 }}
          touch={{ orbitSensitivity: 0.4, distanceSensitivity: 0.2 }}
        />
      </EntityComponent>
      <SupersplatEntity src={src} />
    </>
  );
}

interface SupersplatEntityProps {
  src: string;
}

function SupersplatEntity({ src }: SupersplatEntityProps) {
  const { asset, error } = useSplat(src);

  useEffect(() => {
    if (error) {
      console.error("Failed to load supersplat asset", error);
    }
  }, [error]);

  if (!asset) {
    return null;
  }

  return (
    <EntityComponent position={[0, -0.7, 0]} rotation={[0, 0, 180]}>
      <GSplat asset={asset} />
    </EntityComponent>
  );
}

type OrbitCameraScript = {
  resetAndLookAtPoint(resetPosition: Vec3, lookAtPoint: Vec3): void;
};

type ScriptComponentWithOrbit = ScriptComponent & {
  orbitCamera?: OrbitCameraScript;
};
