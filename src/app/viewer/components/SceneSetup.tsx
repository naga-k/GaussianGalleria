import { Splat } from '@react-three/drei';

interface SceneSetupProps {
  splatUrl: string;
}

export function SceneSetup({ splatUrl }: SceneSetupProps) {
  return (
    <>
      <color attach="background" args={['#000000']} />
      {/* <ambientLight intensity={0.5} /> */}
      {/* <directionalLight position={[0, 2, 2]} intensity={1} /> */}
      <Splat src={splatUrl} />
    </>
  );
}
