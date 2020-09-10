import React, { memo } from "react";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import bigHud from "../static/sprites/big_hud.png";
import bigHudMirrored from "../static/sprites/big_hud_mirrored.png";
import longHud from "../static/sprites/long_hud.png";
import longHudMirrored from "../static/sprites/long_hud_mirrored.png";
import boringHud from "../static/sprites/long_hud_boring.png";
import boringHudMirrored from "../static/sprites/long_hud_boring_mirrored.png";
import { a, Interpolation } from "@react-spring/three";

export type HUDElementProps = {
  longHUDType: string;
  boringHUDType: string;
  bigHUDType: string;

  longHUDPosYZ: [number, number];
  longHUDPosX: Interpolation<number, number>;
  longHUDScale: [number, number, number];

  boringHUDPosX: Interpolation<number, number>;
  boringHUDPosYZ: [number, number];
  boringHUDScale: [number, number, number];

  bigHUDPosX: Interpolation<number, number>;
  bigHUDPosYZ: [number, number];
  bigHUDScale: [number, number, number];

  hudVisibility: boolean;
};

const HUDElement = memo((props: HUDElementProps) => {
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
    spriteTypeToSprite(props.longHUDType, "long")!
  );

  const longHudBoringTexture = useLoader(
    THREE.TextureLoader,
    spriteTypeToSprite(props.boringHUDType, "boring")!
  );

  const bigHudTexture = useLoader(
    THREE.TextureLoader,
    spriteTypeToSprite(props.bigHUDType, "big")!
  );

  return (
    <group visible={props.hudVisibility}>
      <a.sprite
        position-y={props.longHUDPosYZ[0]}
        position-z={props.longHUDPosYZ[1]}
        position-x={props.longHUDPosX}
        scale={props.longHUDScale}
      >
        <spriteMaterial
          attach="material"
          map={longHudTexture}
          transparent={true}
        />
      </a.sprite>
      <a.sprite
        position-x={props.boringHUDPosX}
        position-y={props.boringHUDPosYZ[0]}
        position-z={props.boringHUDPosYZ[1]}
        scale={props.boringHUDScale}
      >
        <spriteMaterial
          attach="material"
          map={longHudBoringTexture}
          transparent={true}
        />
      </a.sprite>
      <a.sprite
        position-x={props.bigHUDPosX}
        position-y={props.bigHUDPosYZ[0]}
        position-z={props.bigHUDPosYZ[1]}
        scale={props.bigHUDScale}
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
