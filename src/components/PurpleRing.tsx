import * as THREE from "three";
import React, { useRef, useState, useEffect } from "react";
import { useLoader, useFrame } from "react-three-fiber";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { draco } from "drei";
import { useSpring, a } from "@react-spring/three";

type GLTFResult = GLTF & {
  nodes: {
    Circle002: THREE.Mesh;
  };
  materials: {};
};

const PurpleRing = (props: JSX.IntrinsicElements["group"]) => {
  const [{ purpleRingRotationY }, setPurpleRingRotationY] = useSpring(
    () => ({
      purpleRingRotationY: 0,
      config: { precision: 0.0001, duration: 1200 },
    }),
    []
  );

  const { nodes, materials } = useLoader<GLTFResult>(
    GLTFLoader,
    "/models/ring1.glb",
    draco("/draco-gltf/")
  );

  useFrame(() => {
    setPurpleRingRotationY(() => ({
      purpleRingRotationY: purpleRingRotationY.get() + 0.04,
    }));
  });

  const purpleRingRotY = purpleRingRotationY.to([0, 1], [0, Math.PI]);

  return (
    <a.group
      position={[0, 0.4, 0]}
      rotation-y={purpleRingRotY}
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
    </a.group>
  );
};

export default PurpleRing;
