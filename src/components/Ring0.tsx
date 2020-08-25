import React, {
  useRef,
  useCallback,
  Suspense,
  useState,
  useEffect,
} from "react";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useThree, useFrame, Canvas, useLoader } from "react-three-fiber";
import { OrbitControls, Html, draco, Icosahedron } from "drei";
import Lain from "./Lain";
import { Mesh, MeshLambertMaterial, DoubleSide } from "three";
import * as THREE from "three";

type Ring0Props = {
  lowerRingPositionY: number;
  lowerRingRotationY: number;
};

type GLTFResult = GLTF & {
  nodes: {
    Circle: THREE.Mesh;
  };
  materials: {};
};

const Ring0 = (props: Ring0Props) => {
  const { nodes, materials } = useLoader<GLTFResult>(
    GLTFLoader,
    "/models/ring0.glb",
    draco("/draco-gltf/")
  );
  return (
    <group
      scale={[1.3, 1.3, 1.3]}
      position={[0, props.lowerRingPositionY, 0]}
      rotation={[0, props.lowerRingRotationY, 0]}
      dispose={null}
    >
      <mesh geometry={nodes.Circle.geometry} rotation={[0, Math.PI / 4, 0]}>
        <meshLambertMaterial
          attach="material"
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default Ring0
