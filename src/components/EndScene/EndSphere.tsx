import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "react-three-fiber";
import secondCylinder from "../../static/sprite/end_cylinder_2.png";

type EndSphereProps = {
  position: number[];
};

const EndSphere = (props: EndSphereProps) => {
  const secondCylinderTex = useLoader(THREE.TextureLoader, secondCylinder);

  const meshRef = useRef<THREE.Object3D>();
  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.005;
  });
  return (
    <mesh
      position={props.position as [number, number, number]}
      ref={meshRef}
      renderOrder={3}
    >
      <sphereBufferGeometry args={[1, 16, 16]} attach="geometry" />
      <meshStandardMaterial
        attach="material"
        map={secondCylinderTex}
        color={0xffffff}
        transparent={true}
        side={THREE.DoubleSide}
        depthTest={false}
        opacity={0.7}
      />
    </mesh>
  );
};

export default EndSphere;
