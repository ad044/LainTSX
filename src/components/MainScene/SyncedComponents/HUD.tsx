import React, { memo } from "react";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import bigHud from "../../../static/sprite/big_hud.png";
import bigHudMirrored from "../../../static/sprite/big_hud_mirrored.png";
import longHud from "../../../static/sprite/long_hud.png";
import longHudMirrored from "../../../static/sprite/long_hud_mirrored.png";
import boringHud from "../../../static/sprite/long_hud_boring.png";
import boringHudMirrored from "../../../static/sprite/long_hud_boring_mirrored.png";
import { a, useSpring } from "@react-spring/three";
import { useHudStore } from "../../../store";
import node_huds from "../../../resources/node_huds.json";

const HUD = () => {
  const active = useHudStore((state) => state.active);
  const id = useHudStore((state) => state.id);

  const currentHud = node_huds[id as keyof typeof node_huds];

  const hudElementState = useSpring({
    bigHUDPositionX: active,
    longHUDPositionX: active,
    boringHUDPositionX: active,
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
    <group position={[0, 0, 10]}>
      <a.sprite
        position-x={longHUDPosX}
        position-y={currentHud!.long.position[1]}
        position-z={currentHud!.long.position[2]}
        scale={[1, 0.03, 1]}
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
        scale={[1, 0.03, 1]}
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
        scale={[0.5, 0.06, 1]}
        renderOrder={2}
      >
        <spriteMaterial
          attach="material"
          map={bigHudTexture}
          transparent={true}
          depthTest={false}
        />
      </a.sprite>
    </group>
  );
};

export default HUD;
