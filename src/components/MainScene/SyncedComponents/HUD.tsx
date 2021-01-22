import React, { useMemo } from "react";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import bigHud from "../../../static/sprite/big_hud.png";
import bigHudMirrored from "../../../static/sprite/big_hud_mirrored.png";
import longHud from "../../../static/sprite/long_hud.png";
import longHudMirrored from "../../../static/sprite/long_hud_mirrored.png";
import boringHud from "../../../static/sprite/long_hud_boring.png";
import boringHudMirrored from "../../../static/sprite/long_hud_boring_mirrored.png";
import { a, useSpring } from "@react-spring/three";
import { useMainSceneStore } from "../../../store";
import MediumLetter from "../../TextRenderer/MediumLetter";
import { NodeDataType } from "./Site";

export type HUDType = {
  mirrored: number;
  long: {
    position: number[];
    initial_position: number[];
  };
  boring: {
    position: number[];
    initial_position: number[];
  };
  big: {
    position: number[];
    initial_position: number[];
  };
  big_text: number[];
  medium_text: {
    position: number[];
    initial_position: number[];
  };
};

const HUD = () => {
  const greenText = useMainSceneStore((state) =>
    state.activeNode.title.split("")
  );
  const active = useMainSceneStore((state) => Number(state.hudActive));
  const currentHud = useMainSceneStore((state) => state.hud);

  const hudElementState = useSpring({
    bigHUDPositionX: active,
    longHUDPositionX: active,
    boringHUDPositionX: active,
    greenTextPositionX: active,
    config: { duration: 400 },
  });

  const bigHUDPosX = hudElementState.bigHUDPositionX.to(
    [0, 1],
    [currentHud.big.initial_position[0], currentHud.big.position[0]]
  );

  const boringHUDPosX = hudElementState.boringHUDPositionX.to(
    [0, 1],
    [currentHud.boring.initial_position[0], currentHud.boring.position[0]]
  );

  const longHUDPosX = hudElementState.longHUDPositionX.to(
    [0, 1],
    [currentHud.long.initial_position[0], currentHud.long.position[0]]
  );

  const greenTextPosX = hudElementState.greenTextPositionX.to(
    [0, 1],
    [
      currentHud.medium_text.initial_position[0],
      currentHud.medium_text.position[0],
    ]
  );

  const longHudTex = useLoader(THREE.TextureLoader, longHud);
  const longHudMirroredTex = useLoader(THREE.TextureLoader, longHudMirrored);

  const boringHudTex = useLoader(THREE.TextureLoader, boringHud);
  const boringHudMirroredTex = useLoader(
    THREE.TextureLoader,
    boringHudMirrored
  );

  const bigHudTex = useLoader(THREE.TextureLoader, bigHud);
  const bigHudMirroredTex = useLoader(THREE.TextureLoader, bigHudMirrored);

  const textures = useMemo(
    () =>
      currentHud.mirrored === 0
        ? [longHudTex, boringHudTex, bigHudTex]
        : [longHudMirroredTex, boringHudMirroredTex, bigHudMirroredTex],
    [
      bigHudMirroredTex,
      bigHudTex,
      boringHudMirroredTex,
      boringHudTex,
      currentHud.mirrored,
      longHudMirroredTex,
      longHudTex,
    ]
  );

  return (
    <group position={[0, 0, 10]}>
      <a.sprite
        position-x={longHUDPosX}
        position-y={currentHud.long.position[1]}
        position-z={currentHud.long.position[2]}
        scale={[1, 0.03, 1]}
        renderOrder={2}
      >
        <spriteMaterial
          attach="material"
          map={textures[0]}
          transparent={true}
          depthTest={false}
        />
      </a.sprite>
      <a.sprite
        position-x={boringHUDPosX}
        position-y={currentHud.boring.position[1]}
        position-z={currentHud.boring.position[2]}
        scale={[1, 0.03, 1]}
        renderOrder={2}
      >
        <spriteMaterial
          attach="material"
          map={textures[1]}
          transparent={true}
          depthTest={false}
        />
      </a.sprite>
      <a.sprite
        position-x={bigHUDPosX}
        position-y={currentHud.big.position[1]}
        position-z={currentHud.big.position[2]}
        scale={[0.5, 0.06, 1]}
        renderOrder={2}
      >
        <spriteMaterial
          attach="material"
          map={textures[2]}
          transparent={true}
          depthTest={false}
        />
      </a.sprite>
      <a.group
        position-x={greenTextPosX}
        position-y={currentHud.medium_text.position[1]}
        position-z={-8.7}
        scale={[0.02, 0.035, 0.02]}
      >
        {greenText.map((letter: string, idx: number) => (
          <MediumLetter letter={letter} letterIdx={idx} key={idx} />
        ))}
      </a.group>
    </group>
  );
};

export default HUD;
