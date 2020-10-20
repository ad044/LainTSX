import React, { useCallback, useEffect, useRef, useState } from "react";

import grayTextureFile from "../static/sprite/gray_box.png";
import darkGrayTextureFile from "../static/sprite/dark_gray_box.png";
import mediaOverlayHud from "../static/sprite/media_hud.png";

import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { OrbitControls } from "drei";
import { a, useTrail } from "@react-spring/three";
import { useMediaStore } from "../store";
import BigLetter from "./TextRenderer/BigLetter";
import MediumLetter from "./TextRenderer/MediumLetter";
import TextRenderer from "./TextRenderer/TextRenderer";

type ShapeProps = {
  position: number[];
  selectable?: boolean;
  active?: boolean;
};

const GrayCube = (props: ShapeProps) => {
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

const GrayTriangularPrism = (props: ShapeProps) => {
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

const MediaOverlay = () => {
  const [grayCubesActive, setGrayCubesActive] = useState(false);
  const mediaHudOverlayTex = useLoader(THREE.TextureLoader, mediaOverlayHud);

  const activeMediaElement = useMediaStore((state) => state.activeMediaElement);

  return (
    <>
      <OrbitControls />
      <sprite scale={[5, 1, 1]} position={[2.65, 2.5, 0]}>
        <spriteMaterial attach="material" map={mediaHudOverlayTex} />
      </sprite>
      <group position={[0.4, -0.3, 0]}>
        <TextRenderer />
        <pointLight intensity={1.2} color={0xffffff} position={[-2, 0, 3]} />

        <GrayCube position={[-2.7, -1.6, 0.6]} active={grayCubesActive} />
        <GrayTriangularPrism
          position={[-3.5, -1.6, 0.6]}
          active={!grayCubesActive}
        />
        <GrayCube position={[-3.5, -0.9, 0.6]} active={grayCubesActive} />
        <GrayTriangularPrism
          position={[-2.7, -0.9, 0.6]}
          active={!grayCubesActive}
        />
        <GrayTriangularPrism
          position={[-3.5, -1.6, 1.2]}
          active={!grayCubesActive}
        />
        <GrayCube position={[-3.5, -0.9, 1.2]} active={grayCubesActive} />
        <GrayCube
          position={[-2.7, -1.6, 1.2]}
          active={grayCubesActive}
          selectable={true}
        />
        <GrayTriangularPrism
          position={[-2.7, -0.9, 1.2]}
          active={!grayCubesActive}
          selectable={true}
        />
      </group>
    </>
  );
};

export default MediaOverlay;
