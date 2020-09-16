import { draco } from "drei";
import React, { memo } from "react";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type GrayRingProps = {
  grayRingPosY: number;
};

type GLTFResult = GLTF & {
  nodes: {
    LainRing: THREE.Mesh;
  };
  materials: {
    RingTexture: THREE.MeshStandardMaterial;
  };
};

const GrayRing = memo((props: GrayRingProps) => {
  const { nodes, materials } = useLoader<GLTFResult>(
    GLTFLoader,
    "/models/ring0.glb",
    draco("/draco-gltf/")
  );

  // -0.27
  return (
    <group
      scale={[1.3, 1.3, 1.3]}
      position={[0, props.grayRingPosY, 0]}
      rotation={[0, 2.6, 0]}
    >
      <mesh
        geometry={nodes.LainRing.geometry}
        rotation={[0, Math.PI / 4, 0]}
        material={materials.RingTexture}
      ></mesh>
    </group>
  );
});

export default GrayRing;
