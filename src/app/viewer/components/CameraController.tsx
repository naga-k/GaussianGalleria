import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';

export function CameraController() {
  const { camera } = useThree();
  const keys = useRef<{ [key: string]: boolean }>({});
  const speed = useRef(0.1);
  const boost = useRef(1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
      if (e.key === 'Shift') boost.current = 2;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
      if (e.key === 'Shift') boost.current = 1;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    const currentSpeed = speed.current * boost.current;

    if (keys.current['w']) camera.translateZ(-currentSpeed);
    if (keys.current['s']) camera.translateZ(currentSpeed);
    if (keys.current['a']) camera.translateX(-currentSpeed);
    if (keys.current['d']) camera.translateX(currentSpeed);
    if (keys.current['q']) camera.translateY(currentSpeed);
    if (keys.current['e']) camera.translateY(-currentSpeed);
    
    if (keys.current['arrowup']) camera.rotateX(0.02);
    if (keys.current['arrowdown']) camera.rotateX(-0.02);
    if (keys.current['arrowleft']) camera.rotateY(0.02);
    if (keys.current['arrowright']) camera.rotateY(-0.02);
  });

  return null;
}
