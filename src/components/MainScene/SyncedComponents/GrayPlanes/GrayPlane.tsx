import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";

type GrayPlaneProps = {
  position: [number, number, number];
};

const GrayPlane = (props: GrayPlaneProps) => {
  const meshRef = useRef<THREE.Object3D>();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.03;
    }
  });

  return (
    <mesh
      scale={[0.04, 10, 0.04]}
      position={props.position as [number, number, number]}
    >
      <planeBufferGeometry attach="geometry" />
      <meshBasicMaterial
        attach="material"
        color={0xd3d3d3}
        opacity={0.2}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default GrayPlane;
