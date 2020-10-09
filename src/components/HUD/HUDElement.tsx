import React, { memo } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import bigHud from "../../static/sprites/big_hud.png";
import bigHudMirrored from "../../static/sprites/big_hud_mirrored.png";
import longHud from "../../static/sprites/long_hud.png";
import longHudMirrored from "../../static/sprites/long_hud_mirrored.png";
import boringHud from "../../static/sprites/long_hud_boring.png";
import boringHudMirrored from "../../static/sprites/long_hud_boring_mirrored.png";
import { a, useSpring } from "@react-spring/three";
import { useRecoilValue } from "recoil";
import {
  bigHudTextAtom,
  hudActiveAtom,
  mediumHudTextAtom,
} from "./HUDElementAtom";
import { currentHUDAtom } from "./HUDElementAtom";
import HUDText from "./HUDText";

export type HUDElementProps = {
  hudVisibility: boolean;
};

type HudShapeData = {
  position: number[];
  scale: number[];
  type: string;
  initial_position: number[];
};

type MediumTextData = {
  position: number[];
  initial_position: number[];
};

export type BlueOrbHudData = {
  long: HudShapeData;
  boring: HudShapeData;
  big: HudShapeData;
  big_text: number[];
  medium_text: MediumTextData;
};

export type BlueOrbHuds = {
  [blue_orb_hud_id: string]: BlueOrbHudData;
};

type LevelYValues = {
  [level: string]: number;
};

const HUDElement = memo((props: HUDElementProps) => {
  const currentHud = useRecoilValue(currentHUDAtom);

  const currentBigHudText = useRecoilValue(bigHudTextAtom);
  const currentMediumHudText = useRecoilValue(mediumHudTextAtom);

  const hudActive = useRecoilValue(hudActiveAtom);

  const hudElementState = useSpring({
    bigHUDPositionX: hudActive,
    longHUDPositionX: hudActive,
    boringHUDPositionX: hudActive,
    config: { duration: 500, friction: 0 },
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

  // these hud elements come in all shapes and forms, some of them are mirrored, rotated
  // you name it. this function allows me to specify whether i want a normal texture
  // for the blue orb or the mirrored/rotated one.
  const spriteTypeToSprite = (spriteType: string, hudElement: string) => {
    switch (spriteType) {
      case "normal":
        switch (hudElement) {
          case "long":
            return longHud;
          case "boring":
            return boringHud;
          case "big":
            return bigHud;
        }
        break;
      case "mirrored":
        switch (hudElement) {
          case "big":
            return bigHudMirrored;
          case "long":
            return longHudMirrored;
          case "boring":
            return boringHudMirrored;
        }
    }
  };

  const longHudTexture = useLoader(
    THREE.TextureLoader,
    spriteTypeToSprite(currentHud.long.type, "long")!
  );

  const longHudBoringTexture = useLoader(
    THREE.TextureLoader,
    spriteTypeToSprite(currentHud.boring.type, "boring")!
  );

  const bigHudTexture = useLoader(
    THREE.TextureLoader,
    spriteTypeToSprite(currentHud.big.type, "big")!
  );

  return (
    <group visible={props.hudVisibility}>
      <a.sprite
        position-x={longHUDPosX}
        position-y={currentHud!.long.position[1]}
        position-z={currentHud!.long.position[2]}
        scale={currentHud.long.scale as [number, number, number]}
        renderOrder={2}
      >
        <spriteMaterial
          attach="material"
          map={longHudTexture}
          transparent={true}
          depthTest={false}
        />
      </a.sprite>
      <a.sprite
        position-x={boringHUDPosX}
        position-y={currentHud!.boring.position[1]}
        position-z={currentHud!.boring.position[2]}
        scale={currentHud!.boring.scale as [number, number, number]}
        renderOrder={2}
      >
        <spriteMaterial
          attach="material"
          map={longHudBoringTexture}
          transparent={true}
          depthTest={false}
        />
      </a.sprite>
      <a.sprite
        position-x={bigHUDPosX}
        position-y={currentHud!.big.position[1]}
        position-z={currentHud!.big.position[2]}
        scale={currentHud!.big.scale as [number, number, number]}
        renderOrder={2}
      >
        <spriteMaterial
          attach="material"
          map={bigHudTexture}
          transparent={true}
          depthTest={false}
        />
      </a.sprite>
      <HUDText bigText={currentBigHudText} mediumText={currentMediumHudText} />
    </group>
  );
});

export default HUDElement;
