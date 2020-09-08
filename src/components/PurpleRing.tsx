import { draco } from "drei";
import React, { memo, RefObject, useRef } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

type PurpleRingProps = {
  purpleRingPosY: number;
};

type GLTFResult = GLTF & {
  nodes: {
    Circle002: THREE.Mesh;
  };
  materials: {};
};

const PurpleRing = memo((props: PurpleRingProps) => {
  const purpleRingRef = useRef<THREE.Object3D>();

  const { nodes } = useLoader<GLTFResult>(
    GLTFLoader,
    "/models/ring1.glb",
    draco("/draco-gltf/")
  );

  useFrame(() => {
    purpleRingRef.current!.rotation.y += 0.01;
  });

  return (
    <group
      position={[0, props.purpleRingPosY, 0]}
      scale={[1.3, 1.3, 1.3]}
      ref={purpleRingRef}
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
});

export default PurpleRing;
