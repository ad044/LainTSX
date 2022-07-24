import React, { useRef, memo } from "react";
import { useTexture } from "@react-three/drei";
import { DoubleSide } from "three";
import { Position } from "@/types";
import { useFrame } from "@react-three/fiber";

type EndSphereProps = {
  position: Position;
  outroAnim: boolean;
};

const EndSphere = (props: EndSphereProps) => {
  const secondCylinder = useTexture("/sprites/end/end_cylinder_2.png");

  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.5 * delta;
      if (
        props.outroAnim &&
        meshRef.current.scale.x > 0 &&
        meshRef.current.scale.y > 0 &&
        meshRef.current.scale.z > 0
      ) {
        meshRef.current.scale.x -= 0.5 * delta;
        meshRef.current.scale.y -= 0.5 * delta;
        meshRef.current.scale.z -= 0.5 * delta;
      }
    }
  });

  return (
    <mesh position={props.position} ref={meshRef} renderOrder={3}>
      <sphereBufferGeometry args={[1, 16, 16]} attach="geometry" />
      <meshStandardMaterial
        map={secondCylinder}
        color={0xffffff}
        transparent={true}
        side={DoubleSide}
        depthTest={false}
        opacity={0.7}
      />
    </mesh>
  );
};

export default memo(EndSphere);
