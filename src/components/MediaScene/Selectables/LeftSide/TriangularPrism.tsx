import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import grayTextureFile from "../../../../static/sprite/gray_box.png";
import darkGrayTextureFile from "../../../../static/sprite/dark_gray_box.png";
import React, { memo, useRef } from "react";
import { ShapeProps } from "../LeftSide";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

type GLTFResult = GLTF & {
  nodes: {
    Cube001: THREE.Mesh;
  };
  materials: {
    ["Material.001"]: THREE.MeshStandardMaterial;
  };
};

const TriangularPrism = memo((props: ShapeProps) => {
  const grayTex = useLoader(THREE.TextureLoader, grayTextureFile);
  const darkGrayTex = useLoader(THREE.TextureLoader, darkGrayTextureFile);

  const { nodes } = useLoader<GLTFResult>(GLTFLoader, "models/cutcube.glb");

  const prismRef = useRef<THREE.Object3D>();

  useFrame(() => {
    if (props.selectable && props.active) {
      prismRef.current!.rotation.y -= 0.015;
    } else {
      prismRef.current!.rotation.y = 0;
    }
  });

  return (
    <mesh
      scale={[0.45 / 2, 0.5 / 2, 0.45 / 2]}
      position={props.position as [number, number, number]}
      rotation-y={0.15}
      rotation-z={-0.02}
      ref={prismRef}
      geometry={nodes["Cube001"].geometry}
    >
      <meshLambertMaterial
        attach="material"
        map={props.active ? grayTex : darkGrayTex}
      />
    </mesh>
  );
});

export default TriangularPrism;
