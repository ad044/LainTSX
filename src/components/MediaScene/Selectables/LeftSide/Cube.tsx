import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import grayTextureFile from "../../../../static/sprite/gray_box.png";
import darkGrayTextureFile from "../../../../static/sprite/dark_gray_box.png";
import React, { useRef } from "react";
import { ShapeProps } from "./LeftSide";

const Cube = (props: ShapeProps) => {
  const grayTex = useLoader(THREE.TextureLoader, grayTextureFile);
  const darkGrayTex = useLoader(THREE.TextureLoader, darkGrayTextureFile);

  const cubeRef = useRef<THREE.Object3D>();

  useFrame(() => {
    if (props.selectable && props.active) {
      cubeRef.current!.rotation.y -= 0.015;
    } else {
      cubeRef.current!.rotation.y = 0;
    }
  });

  return (
    <mesh
      scale={[0.45, 0.5, 0.45]}
      position={props.position as [number, number, number]}
      rotation-y={0.15}
      rotation-z={-0.02}
      ref={cubeRef}
    >
      <boxBufferGeometry args={[1, 1, 1]} attach="geometry" />
      <meshLambertMaterial
        attach="material"
        map={props.active ? grayTex : darkGrayTex}
      />
    </mesh>
  );
};

export default Cube;
