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

export type HUDElementProps = {
  hudVisibility: boolean;
};

type HudShapeData = {
  position: number[];
  scale: number[];
  type: string;
  initial_position: number[];
};

export type SpriteHudData = {
  long: HudShapeData;
  boring: HudShapeData;
  big: HudShapeData;
};

export type SpriteHuds = {
  [sprite_hud_id: string]: SpriteHudData;
};

const HUDElement = memo((props: HUDElementProps) => {
  const currentSpriteHUD = useRecoilValue(currentHUDAtom);
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
      currentSpriteHUD["big"]["initial_position"][0],
      currentSpriteHUD["big"]["position"][0],
    ]
  );

  const boringHUDPosX = boringHUDPositionX.to(
    [0, 1],
    [
      currentSpriteHUD["boring"]["initial_position"][0],
      currentSpriteHUD["boring"]["position"][0],
    ]
  );

  const longHUDPosX = longHUDPositionX.to(
    [0, 1],
    [
      currentSpriteHUD["long"]["initial_position"][0],
      currentSpriteHUD["long"]["position"][0],
    ]
  );

  // these hud elements come in all shapes and forms, some of them are mirrored, rotated
  // you name it. this function allows me to specify whether i want a normal texture
  // for the sprite or the mirrored/rotated one.
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
    spriteTypeToSprite(currentSpriteHUD["long"]["type"], "long")!
  );

  const longHudBoringTexture = useLoader(
    THREE.TextureLoader,
    spriteTypeToSprite(currentSpriteHUD["boring"]["type"], "boring")!
  );

  const bigHudTexture = useLoader(
    THREE.TextureLoader,
    spriteTypeToSprite(currentSpriteHUD["big"]["type"], "big")!
  );

  return (
    <group visible={props.hudVisibility} renderOrder={1}>
      <a.sprite
        position-x={longHUDPosX}
        position-y={currentSpriteHUD["long"]["position"][1]}
        position-z={currentSpriteHUD["long"]["position"][2]}
        scale={currentSpriteHUD["long"]["scale"] as [number, number, number]}
      >
        <spriteMaterial
          attach="material"
          map={longHudTexture}
          transparent={true}
        />
      </a.sprite>
      <a.sprite
        position-x={boringHUDPosX}
        position-y={currentSpriteHUD!["boring"]["position"][1]}
        position-z={currentSpriteHUD!["boring"]["position"][2]}
        scale={currentSpriteHUD!["boring"]["scale"] as [number, number, number]}
      >
        <spriteMaterial
          attach="material"
          map={longHudBoringTexture}
          transparent={true}
        />
      </a.sprite>
      <a.sprite
        position-x={bigHUDPosX}
        position-y={currentSpriteHUD!["big"]["position"][1]}
        position-z={currentSpriteHUD!["big"]["position"][2]}
        scale={currentSpriteHUD!["big"]["scale"] as [number, number, number]}
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
