import { draco } from "drei";
import React from "react";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type GrayRingProps = {
  lowerRingPositionY: number;
  lowerRingRotationY: number;
};

type GLTFResult = GLTF & {
  nodes: {
    Circle: THREE.Mesh;
  };
  materials: {};
};

const GrayRing = (props: any) => {
  const { nodes } = useLoader<GLTFResult>(
    GLTFLoader,
    "/models/ring0.glb",
    draco("/draco-gltf/")
  );

  return (
    <group
      scale={[1.3, 1.3, 1.3]}
      position={[0, -0.27, 0]}
      rotation={[0, 0.26, 0]}
      dispose={null}
    >
      <mesh geometry={nodes.Circle.geometry} rotation={[0, Math.PI / 4, 0]}>
        <meshLambertMaterial
          attach="material"
          color={0x636363}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default GrayRing;
