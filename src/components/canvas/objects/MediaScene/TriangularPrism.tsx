import { useFrame } from "@react-three/fiber";
import React, { memo, useRef } from "react";
import { GLTF } from "three-stdlib/loaders/GLTFLoader";
import { useGLTF, useTexture } from "@react-three/drei";
import { Position } from "@/types";

type GLTFResult = GLTF & {
  nodes: {
    Cube001: THREE.Mesh;
  };
  materials: {
    ["Material.001"]: THREE.MeshStandardMaterial;
  };
};

type TriangularPrismProps = {
  position: Position;
  selectable?: boolean;
  active?: boolean;
};

const TriangularPrism = (props: TriangularPrismProps) => {
  const gray = useTexture("/sprites/media/gray_box.png");
  const darkGray = useTexture("/sprites/media/dark_gray_box.png");

  const { nodes } = useGLTF("models/cut_cube.glb") as GLTFResult;

  const prismRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (props.selectable && props.active) {
      prismRef.current!.rotation.y -= delta;
    } else {
      prismRef.current!.rotation.y = 0;
    }
  });

  return (
    <mesh
      scale={[0.45 / 2, 0.5 / 2, 0.45 / 2]}
      position={props.position}
      rotation-y={0.15}
      rotation-z={-0.02}
      ref={prismRef}
      geometry={nodes["Cube001"].geometry}
    >
      <meshLambertMaterial map={props.active ? gray : darkGray} />
    </mesh>
  );
};

export default memo(TriangularPrism);
