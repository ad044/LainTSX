import React, { useCallback, useRef, useState } from "react";

import grayTextureFile from "../../static/sprite/gray_box.png";
import darkGrayTextureFile from "../../static/sprite/dark_gray_box.png";
import mediaOverlayHud from "../../static/sprite/media_hud.png";

import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { OrbitControls } from "drei";
import { useMediaStore, useMediaWordStore } from "../../store";
import TextRenderer from "../TextRenderer/TextRenderer";
import LeftSide from "./LeftSide/LeftSide";
import Word from "./RightSide/Word";
import RightSide from "./RightSide/RightSide";

const MediaScene = () => {
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
        <group position={[0, 0, 13]} scale={[1, 1, 1]}>
          <TextRenderer />
        </group>

        <pointLight intensity={1.2} color={0xffffff} position={[-2, 0, 3]} />
        <LeftSide activeMediaElement={activeMediaElement} />
        <RightSide activeMediaElement={activeMediaElement} />
      </group>
    </>
  );
};

export default MediaScene;
