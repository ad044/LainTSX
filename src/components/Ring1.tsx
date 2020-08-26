import * as THREE from "three";
import React, { useRef, useState, useEffect } from "react";
import { useLoader } from "react-three-fiber";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { draco } from "drei";

type GLTFResult = GLTF & {
  nodes: {
    Circle002: THREE.Mesh;
  };
  materials: {};
};

const Ring1 = (props: JSX.IntrinsicElements["group"]) => {
  const [higherRingRotation, setHigherRingRotation] = useState(0);

  const { nodes, materials } = useLoader<GLTFResult>(
    GLTFLoader,
    "/models/ring1.glb",
    draco("/draco-gltf/")
  );

  const ring1PermaRotation = () => {
    setHigherRingRotation((prev) => prev + 0.002);
  };

  useEffect(() => {
    setInterval(ring1PermaRotation, 1);
  }, []);

  return (
    <group
      position={[0, 0.4, 0]}
      rotation={[0, higherRingRotation, 0]}
      scale={[1.3, 1.3, 1.3]}
      dispose={null}
    >
      <mesh geometry={nodes.Circle002.geometry} rotation={[0, Math.PI / 4, 0]}>
        <meshLambertMaterial
          attach="material"
          color={0x8b6ff7}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default Ring1;
