import React, { memo } from "react";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";

type CrystalRingProps = {
  crystalRingPosY: number;
};

type GLTFResult = GLTF & {
  nodes: {
    gron: THREE.Mesh;
  };
  materials: {};
};

const CyanCrystal = memo((props: CrystalRingProps) => {
  const { nodes } = useLoader<GLTFResult>(GLTFLoader, "models/cyancrystal.glb");

  return (
    <mesh
      geometry={nodes.gron.geometry}
      position={[1.3, props.crystalRingPosY, -0.1]}
      scale={[4, 8, 4]}
      rotation={[0, -4.6, 0]}
    >
      <meshPhongMaterial
        attach="material"
        color={0x04f9d2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
});

export default CyanCrystal;
