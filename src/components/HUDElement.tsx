import React from "react";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import bigHud from "../static/sprites/big_hud.png";
import longHud from "../static/sprites/long_hud.png";
import boringHud from "../static/sprites/long_hud_boring.png";
import { PositionAndScaleProps } from "./Hub";
import { a, Interpolation } from "@react-spring/three";

export type HUDElementProps = {
  longHudType: string;
  boringHudType: string;
  bigHudType: string;

  longHudPosition: PositionAndScaleProps;
  longHUDPosX: Interpolation<number, any>;
  longHudScale: PositionAndScaleProps;

  // boringHudPosition: PositionAndScaleProps;
  boringHudScale: PositionAndScaleProps;

  // bigHudPosition: PositionAndScaleProps;
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
      <a.sprite
        position={props.longHudPosition}
        position-x={props.longHUDPosX}
        scale={props.longHudScale}
      >
        <spriteMaterial
          attach="material"
          map={longHudTexture}
          transparent={true}
        />
      </a.sprite>
      {/* <sprite position={props.boringHudPosition} scale={props.boringHudScale}>
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
      </sprite> */}
    </>
  );
};

export default HUDElement;
