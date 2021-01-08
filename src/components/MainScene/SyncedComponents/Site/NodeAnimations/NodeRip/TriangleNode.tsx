import React, { useRef } from "react";
import MULTI from "../../../../../../static/sprite/MULTI.png";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";

type TriangleNodeProps = {
  rotation: number[];
  pivotRotation: number[];
};

const TriangleNode = (props: TriangleNodeProps) => {
  const tex = useLoader(THREE.TextureLoader, MULTI);

  const triangleNodeRef = useRef<THREE.Object3D>();

  useFrame(() => {
    if (triangleNodeRef.current) {
      triangleNodeRef.current.position.z += 0.01;
    }
  });

  return (
    <group rotation={props.pivotRotation as [number, number, number]}>
      <mesh
        position={[-0.1, -0.2, 0.1]}
        rotation={props.rotation as [number, number, number]}
        scale={[0.1, 0.1, 0.1]}
        ref={triangleNodeRef}
      >
        <coneBufferGeometry attach="geometry" args={[1, 2, 3]} />
        <meshBasicMaterial attach="material" map={tex} transparent={true} />
      </mesh>
    </group>
  );
};

export default TriangleNode;
