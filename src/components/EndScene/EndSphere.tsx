import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "react-three-fiber";
import secondCylinder from "../../static/sprites/end/end_cylinder_2.png";

type EndSphereProps = {
  position: number[];
  outroAnim: boolean;
};

const EndSphere = (props: EndSphereProps) => {
  const secondCylinderTex = useLoader(THREE.TextureLoader, secondCylinder);

  const meshRef = useRef<THREE.Object3D>();
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      if (
        props.outroAnim &&
        meshRef.current.scale.x > 0 &&
        meshRef.current.scale.y > 0 &&
        meshRef.current.scale.z > 0
      ) {
        meshRef.current.scale.x -= 0.025;
        meshRef.current.scale.y -= 0.025;
        meshRef.current.scale.z -= 0.025;
      }
    }
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
