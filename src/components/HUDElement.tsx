import React, { Suspense } from "react";
import { useFrame, useLoader, useThree } from "react-three-fiber";
import * as THREE from "three";
import longHud from "../static/sprites/long_hud.png";
import boringHud from "../static/sprites/long_hud_boring.png";
import bigHud from "../static/sprites/big_hud.png";
import { PositionAndScaleProps } from "./Hub";

export type HUDElementProps = {
  longHudType: string;
  boringHudType: string;
  bigHudType: string;

  longHudPosition: PositionAndScaleProps;
  longHudScale: PositionAndScaleProps;

  boringHudPosition: PositionAndScaleProps;
  boringHudScale: PositionAndScaleProps;

  bigHudPosition: PositionAndScaleProps;
  bigHudScale: PositionAndScaleProps;
};

const HUDElement = (props: HUDElementProps) => {
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
    }
  };

  const longHudTexture: any = useLoader(
    THREE.TextureLoader,
    spriteTypeToSprite(props.longHudType, "long")!
  );

  const longHudBoringTexture: any = useLoader(
    THREE.TextureLoader,
    spriteTypeToSprite(props.boringHudType, "boring")!
  );

  const bigHudTexture: any = useLoader(
    THREE.TextureLoader,
    spriteTypeToSprite(props.bigHudType, "big")!
  );

  return (
    <>
      <sprite position={props.longHudPosition} scale={props.longHudScale}>
        <spriteMaterial
          attach="material"
          map={longHudTexture}
          transparent={true}
        />
      </sprite>
      <sprite position={props.boringHudPosition} scale={props.boringHudScale}>
        <spriteMaterial
          attach="material"
          map={longHudBoringTexture}
          transparent={true}
        />
      </sprite>
      <sprite position={props.bigHudPosition} scale={props.bigHudScale}>
        <spriteMaterial
          attach="material"
          map={bigHudTexture}
          transparent={true}
        />
      </sprite>
    </>
  );
};

export default HUDElement;
