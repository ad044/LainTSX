import React, { useRef } from "react";
import { DoubleSide } from "three";
import { useFrame } from "@react-three/fiber";
import { Position } from "@/types";

type GrayPlaneProps = {
  position: Position;
};

const GrayPlane = (props: GrayPlaneProps) => {
  const meshRef = useRef<THREE.Sprite>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta / 4;
    }
  });

  return (
    <mesh scale={[0.04, 10, 0.04]} position={props.position}>
      <planeBufferGeometry attach="geometry" />
      <meshBasicMaterial
        color={0xd3d3d3}
        opacity={0.2}
        transparent={true}
        side={DoubleSide}
      />
    </mesh>
  );
};

export default GrayPlane;
