import React, { memo } from "react";
import { DoubleSide } from "three";
import { GLTF } from "three-stdlib/loaders/GLTFLoader";
import { useGLTF } from "@react-three/drei";

type GLTFResult = GLTF & {
  nodes: {
    gron: THREE.Mesh;
  };
  materials: {};
};

const CyanCrystal = () => {
  const { nodes } = useGLTF("models/cyan_crystal.glb") as GLTFResult;

  return (
    <mesh
      geometry={nodes.gron.geometry}
      position={[1.3, -0.45, -0.1]}
      scale={[4, 8, 4]}
      rotation={[0, -4.6, 0]}
    >
      <meshPhongMaterial color={0x04f9d2} side={DoubleSide} />
    </mesh>
  );
};

export default memo(CyanCrystal);
