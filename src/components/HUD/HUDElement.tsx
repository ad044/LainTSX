import React, { memo } from "react";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import bigHud from "../../static/sprites/big_hud.png";
import bigHudMirrored from "../../static/sprites/big_hud_mirrored.png";
import longHud from "../../static/sprites/long_hud.png";
import longHudMirrored from "../../static/sprites/long_hud_mirrored.png";
import boringHud from "../../static/sprites/long_hud_boring.png";
import boringHudMirrored from "../../static/sprites/long_hud_boring_mirrored.png";
import { a, useSpring, useTrail } from "@react-spring/three";
import { useRecoilValue } from "recoil";
import { useBlueOrbStore } from "../store";
import blue_orb_huds from "../../resources/blue_orb_huds.json";
import site_a from "../../resources/site_a.json";
import { BigLetter, MediumLetter } from "../TextRenderer/TextRenderer";
import { isSiteYChangingAtom } from "../Site/SiteAtom";

export type HUDElementProps = {
  hudVisibility: boolean;
};

const HUDElement = memo((props: HUDElementProps) => {
  const hudActive = useBlueOrbStore((state) => state.hudActive);

  const currentBlueOrbId = useBlueOrbStore((state) => state.blueOrbId);
  const currentHudId = useBlueOrbStore((state) => state.hudId);

  const yellowHudTextPosY = useBlueOrbStore((state) => state.yellowHudTextPosY);
  const yellowHudTextPosX = useBlueOrbStore((state) => state.yellowHudTextPosX);

  const currentHud = blue_orb_huds[currentHudId as keyof typeof blue_orb_huds];

  const currentYellowHudText = useBlueOrbStore((state) => state.yellowHudText);
  const currentGreenHudText =
    site_a[currentBlueOrbId as keyof typeof site_a].green_text;

  const yellowTextArr = currentYellowHudText.split("");
  const greenTextArr = currentGreenHudText.split("");

  const yellowLetterPosY = yellowHudTextPosY;
  const yellowLetterPosX = yellowHudTextPosX;

  const isSiteChangingY = useRecoilValue(isSiteYChangingAtom);

  // this one is used for letter actions
  const letterTrail = useTrail(currentYellowHudText.length, {
    yellowLetterPosX: yellowLetterPosX,
    yellowLetterPosY: yellowLetterPosY,
    config: { duration: 280 },
  });

  // this one is used when the site moves up/down and
  // the text has to stay stationary
  const letterStaticState = useSpring({
    yellowLetterPosX: yellowLetterPosX,
    yellowLetterPosY: yellowLetterPosY,
    config: { duration: 1200 },
  });

  const { greenTextHUDPositionX } = useSpring({
    greenTextHUDPositionX: hudActive,
    config: { duration: 500 },
  });

  const mediumHudPosX = greenTextHUDPositionX.to(
    [0, 1],
    [
      currentHud["medium_text"]["initial_position"][0],
      currentHud["medium_text"]["position"][0],
    ]
  );

  const hudElementState = useSpring({
    bigHUDPositionX: hudActive,
    longHUDPositionX: hudActive,
    boringHUDPositionX: hudActive,
    config: { duration: 500 },
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
      {isSiteChangingY
        ? yellowTextArr.map((letter, idx) => (
            <a.group
              key={idx}
              position-x={letterStaticState.yellowLetterPosX}
              position-y={letterStaticState.yellowLetterPosY}
              position-z={-8.7}
              scale={[0.04, 0.06, 0.04]}
            >
              <BigLetter
                color={"yellow"}
                letter={yellowTextArr[idx]}
                kerningOffset={idx}
                key={idx}
              />
            </a.group>
          ))
        : letterTrail.map(({ yellowLetterPosX, yellowLetterPosY }, idx) => (
            <a.group
              key={idx}
              position-x={yellowLetterPosX}
              position-y={yellowLetterPosY}
              position-z={-8.7}
              scale={[0.04, 0.06, 0.04]}
            >
              <BigLetter
                color={"yellow"}
                letter={yellowTextArr[idx]}
                kerningOffset={idx}
                key={idx}
              />
            </a.group>
          ))}
      <a.group
        position-x={mediumHudPosX}
        position-y={currentHud["medium_text"]["position"][1]}
        position-z={-8.7}
        scale={[0.02, 0.035, 0.02]}
      >
        {greenTextArr.map((letter, idx) => (
          <MediumLetter
            color={"yellow"}
            letter={letter}
            kerningOffset={idx}
            key={idx}
          />
        ))}
      </a.group>
    </group>
  );
});

export default HUDElement;
