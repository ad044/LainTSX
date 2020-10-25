import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import grayTextureFile from "../../../../static/sprite/gray_box.png";
import darkGrayTextureFile from "../../../../static/sprite/dark_gray_box.png";
import React, { useRef } from "react";
import { ShapeProps } from "./LeftSide";

const TriangularPrism = (props: ShapeProps) => {
  const grayTex = useLoader(THREE.TextureLoader, grayTextureFile);
  const darkGrayTex = useLoader(THREE.TextureLoader, darkGrayTextureFile);

  const prismRef = useRef<THREE.Object3D>();

  const verts = new Float32Array([
    // Top
    0,
    0,
    0,
    1,
    0,
    0,
    1,
    1,
    0,

    0,
    0,
    0,
    1,
    1,
    0,
    0,
    1,
    0,

    // Bottom
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    1,
    1,

    0,
    0,
    0,
    0,
    1,
    0,
    0,
    1,
    1,

    // Sides
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    0,
    0,

    0,
    1,
    1,
    0,
    1,
    0,
    1,
    1,
    0,

    // Hypotenuse
    1,
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    1,

    0,
    0,
    1,
    1,
    1,
    0,
    0,
    1,
    1,
  ]);

  useFrame(() => {
    if (props.selectable && props.active) {
      prismRef.current!.rotation.y -= 0.015;
    } else {
      prismRef.current!.rotation.y = 0;
    }
  });

  return (
    <mesh
      scale={[0.45, 0.5, 0.45]}
      position={props.position as [number, number, number]}
      rotation-y={0.15}
      rotation-z={-0.02}
      ref={prismRef}
    >
      <boxBufferGeometry args={[1, 1, 1]} attach="geometry" />
      <meshLambertMaterial
        attach="material"
        map={props.active ? grayTex : darkGrayTex}
      />
    </mesh>

    // <mesh
    //     scale={[0.45, 0.5, 0.45]}
    //     position={props.position as [number, number, number]}
    //     rotation-y={0.15}
    //     rotation-x={-1.45}
    //     ref={prismRef}
    //   >
    //     <bufferGeometry attach="geometry">
    //       <bufferAttribute
    //         array={verts}
    //         itemSize={3}
    //         count={verts.length / 3}
    //         attachObject={["attributes", "position"]}
    //       />
    //     </bufferGeometry>
    //     <meshBasicMaterial
    //       side={THREE.DoubleSide}
    //       attach="material"
    //       map={props.active ? grayTex : darkGrayTex}
    //     />
    //   </mesh>
  );
};

export default TriangularPrism;