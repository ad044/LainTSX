import { useFrame } from "@react-three/fiber";
import React, { memo, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { Position } from "@/types";

type CubeProps = {
  position: Position;
  selectable?: boolean;
  active?: boolean;
};

const Cube = (props: CubeProps) => {
  const gray = useTexture("/sprites/media/gray_box.png");
  const darkGray = useTexture("/sprites/media/dark_gray_box.png");

  const cubeRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (props.selectable && props.active) {
      cubeRef.current!.rotation.y -= delta;
    } else {
      cubeRef.current!.rotation.y = 0;
    }
  });

  return (
    <mesh
      scale={[0.45, 0.5, 0.45]}
      position={props.position}
      rotation={[0, -0.15, -0.02]}
      ref={cubeRef}
    >
      <boxBufferGeometry args={[1, 1, 1]} attach="geometry" />
      <meshLambertMaterial map={props.active ? gray : darkGray} />
    </mesh>
  );
};

export default memo(Cube);
