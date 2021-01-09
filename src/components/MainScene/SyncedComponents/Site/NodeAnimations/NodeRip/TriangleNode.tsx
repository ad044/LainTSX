import React, { useEffect, useRef } from "react";
import MULTI from "../../../../../../static/sprite/MULTI.png";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";

type TriangleNodeProps = {
  rotation: number[];
  pivotRotation: number[];
  shouldAnimate: boolean;
};

const TriangleNode = (props: TriangleNodeProps) => {
  const tex = useLoader(THREE.TextureLoader, MULTI);

  const triangleNodeRef = useRef<THREE.Object3D>();

  useFrame(() => {
    if (triangleNodeRef.current && props.shouldAnimate) {
      triangleNodeRef.current.position.z += 0.05;
    }
  });

  useEffect(() => {
    if (triangleNodeRef.current && !props.shouldAnimate) {
      triangleNodeRef.current.position.z = 0;
    }
  }, [props.shouldAnimate]);

  return (
    <group rotation={props.pivotRotation as [number, number, number]}>
      <mesh
        position={[-0.1, -0.3, 0.1]}
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
