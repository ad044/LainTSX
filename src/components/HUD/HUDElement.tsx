import React, { memo } from "react";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import bigHud from "../../static/sprites/big_hud.png";
import bigHudMirrored from "../../static/sprites/big_hud_mirrored.png";
import longHud from "../../static/sprites/long_hud.png";
import longHudMirrored from "../../static/sprites/long_hud_mirrored.png";
import boringHud from "../../static/sprites/long_hud_boring.png";
import boringHudMirrored from "../../static/sprites/long_hud_boring_mirrored.png";
import { a, useSpring } from "@react-spring/three";
import { useRecoilValue } from "recoil";
import { hudActiveAtom } from "./HUDElementAtom";
import { currentHUDAtom } from "./HUDElementAtom";
import level_y_values from "../../resources/level_y_values.json";
import { currentBlueOrbAtom } from "../BlueOrb/CurrentBlueOrbAtom";

export type HUDElementProps = {
  hudVisibility: boolean;
};

type HudShapeData = {
  position: number[];
  scale: number[];
  type: string;
  initial_position: number[];
};

export type BlueOrbHudData = {
  long: HudShapeData;
  boring: HudShapeData;
  big: HudShapeData;
};

export type BlueOrbHuds = {
  [blue_orb_hud_id: string]: BlueOrbHudData;
};

type LevelYValues = {
  [level: string]: number;
};
const HUDElement = memo((props: HUDElementProps) => {
  const currentBlueOrbHUD = useRecoilValue(currentHUDAtom);

  const currentBlueOrb = useRecoilValue(currentBlueOrbAtom);

  const hudActive = useRecoilValue(hudActiveAtom);

  const { bigHUDPositionX } = useSpring({
    bigHUDPositionX: hudActive,
    config: { duration: 500 },
  });

  const { longHUDPositionX } = useSpring({
    longHUDPositionX: hudActive,
    config: { duration: 500 },
  });

  const { boringHUDPositionX } = useSpring({
    boringHUDPositionX: hudActive,
    config: { duration: 500 },
  });

  const bigHUDPosX = bigHUDPositionX.to(
    [0, 1],
    [
      currentBlueOrbHUD["big"]["initial_position"][0],
      currentBlueOrbHUD["big"]["position"][0],
    ]
  );

  const boringHUDPosX = boringHUDPositionX.to(
    [0, 1],
    [
      currentBlueOrbHUD["boring"]["initial_position"][0],
      currentBlueOrbHUD["boring"]["position"][0],
    ]
  );

  const longHUDPosX = longHUDPositionX.to(
    [0, 1],
    [
      currentBlueOrbHUD["long"]["initial_position"][0],
      currentBlueOrbHUD["long"]["position"][0],
    ]
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
    spriteTypeToSprite(currentBlueOrbHUD["long"]["type"], "long")!
  );

  const longHudBoringTexture = useLoader(
    THREE.TextureLoader,
    spriteTypeToSprite(currentBlueOrbHUD["boring"]["type"], "boring")!
  );

  const bigHudTexture = useLoader(
    THREE.TextureLoader,
    spriteTypeToSprite(currentBlueOrbHUD["big"]["type"], "big")!
  );

  return (
    <group visible={props.hudVisibility} renderOrder={1}>
      <a.sprite
        position-x={longHUDPosX}
        position-y={
          currentBlueOrbHUD["long"]["position"][1]
        }
        position-z={currentBlueOrbHUD["long"]["position"][2]}
        scale={currentBlueOrbHUD["long"]["scale"] as [number, number, number]}
      >
        <spriteMaterial
          attach="material"
          map={longHudTexture}
          transparent={true}
        />
      </a.sprite>
      <a.sprite
        position-x={boringHUDPosX}
        position-y={
          currentBlueOrbHUD!["boring"]["position"][1]
        }
        position-z={currentBlueOrbHUD!["boring"]["position"][2]}
        scale={
          currentBlueOrbHUD!["boring"]["scale"] as [number, number, number]
        }
      >
        <spriteMaterial
          attach="material"
          map={longHudBoringTexture}
          transparent={true}
        />
      </a.sprite>
      <a.sprite
        position-x={bigHUDPosX}
        position-y={
          currentBlueOrbHUD!["big"]["position"][1]
        }
        position-z={currentBlueOrbHUD!["big"]["position"][2]}
        scale={currentBlueOrbHUD!["big"]["scale"] as [number, number, number]}
      >
        <spriteMaterial
          attach="material"
          map={bigHudTexture}
          transparent={true}
        />
      </a.sprite>
    </group>
  );
});

export default HUDElement;
