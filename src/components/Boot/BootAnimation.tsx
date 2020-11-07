import React, { useEffect, useMemo, useRef, useState } from "react";
import bootLof from "../../static/sprite/boot_lof.png";
import bootBottomBarLeft from "../../static/sprite/boot_bottom_bar_left.png";
import bootBottomBarRight from "../../static/sprite/boot_bottom_bar_right.png";
import bootPurpleSquare from "../../static/sprite/boot_purple_square.png";
import bootGraySquare from "../../static/sprite/boot_gray_square.png";
import bootDangoText from "../../static/sprite/dango_text.png";
import bootMisoShio from "../../static/sprite/miso_shio.png";
import bootArrows from "../../static/sprite/boot_arrows.png";
import bootStatusTexts from "../../static/sprite/boot_status_texts.png";

import { useFrame, useLoader } from "react-three-fiber";
import { a, useSpring } from "@react-spring/three";
import * as THREE from "three";

const BootAnimation = () => {
  const bootLofTex = useLoader(THREE.TextureLoader, bootLof);
  const bootBottomBarLeftTex = useLoader(
    THREE.TextureLoader,
    bootBottomBarLeft
  );
  const bootBottomBarRightTex = useLoader(
    THREE.TextureLoader,
    bootBottomBarRight
  );
  const bootPurpleSquareTex = useLoader(THREE.TextureLoader, bootPurpleSquare);
  const bootGraySquareTex = useLoader(THREE.TextureLoader, bootGraySquare);
  const bootDangoTextTex = useLoader(THREE.TextureLoader, bootDangoText);
  const bootMisoShioTex = useLoader(THREE.TextureLoader, bootMisoShio);
  const bootArrowsTex = useLoader(THREE.TextureLoader, bootArrows);
  const bootStatusTextsTex = useLoader(THREE.TextureLoader, bootStatusTexts);

  const graySquareRef = useRef<THREE.SpriteMaterial>();
  const arrowRef = useRef<THREE.Object3D>();

  useFrame(() => {
    if (graySquareRef.current) {
      graySquareRef.current.rotation -= 0.1;
    }
    if (arrowRef.current && Date.now() % 5 === 0) {
      arrowRef.current.position.y =
        arrowRef.current.position.y === -1.04 ? -0.96 : -1.04;
    }
  });

  const currentBootStatusTextTex = useMemo(() => {
    bootStatusTextsTex.offset.y = 0.79;
    bootStatusTextsTex.repeat.set(0.5, 0.2);
    return bootStatusTextsTex;
  }, [bootStatusTextsTex]);

  useEffect(() => {
    setTimeout(() => {
      currentBootStatusTextTex.offset.y = 0.528;
    }, 900);

    setTimeout(() => {
      currentBootStatusTextTex.offset.y = 0.79;
    }, 1200);

    setTimeout(() => {
      currentBootStatusTextTex.offset.y = 0.264;
    }, 1500);

    setTimeout(() => {
      currentBootStatusTextTex.offset.y = 0.79;
    }, 1600);

    setTimeout(() => {
      currentBootStatusTextTex.offset.x = 0.5;
      currentBootStatusTextTex.offset.y = 0.264;
    }, 2100);

    setTimeout(() => {
      currentBootStatusTextTex.offset.x = 0;
      currentBootStatusTextTex.offset.y = 0.005;
    }, 2400);

    setTimeout(() => {
      currentBootStatusTextTex.offset.y = 0.79;
    }, 2500);

    setTimeout(() => {
      currentBootStatusTextTex.offset.x = 0.5;
      currentBootStatusTextTex.offset.y = 0.005;
      setBootOpacity(0);
      setGraySquarePosY(0);
      setLofPosX(1.3);
      setLofPosY(1);
    }, 4000);
  }, [currentBootStatusTextTex.offset]);

  const [bootOpacity, setBootOpacity] = useState(1);
  const [graySquarePosY, setGraySquarePosY] = useState(-0.8);
  const [lofPosX, setLofPosX] = useState(0);
  const [lofPosY, setLofPosY] = useState(0);

  const bootState = useSpring({
    bootOpacity: bootOpacity,
    config: { duration: 300 },
  });

  const positionState = useSpring({
    graySquarePosY: graySquarePosY,
    lofPosX: lofPosX,
    lofPosY: lofPosY,
    config: { duration: 600 },
  });

  return (
    <>
      <a.sprite
        scale={[1.2, 0.4, 0]}
        position-x={positionState.lofPosX}
        position-y={positionState.lofPosY}
      >
        <spriteMaterial attach="material" map={bootLofTex} />
      </a.sprite>
      <sprite scale={[2.2, 0.66, 0]} position={[-1.1, -0.8, 0]}>
        <a.spriteMaterial
          attach="material"
          map={bootBottomBarLeftTex}
          opacity={bootState.bootOpacity}
        />
      </sprite>
      <sprite scale={[2.2, 0.66, 0]} position={[1.1, -0.8, 0]}>
        <a.spriteMaterial
          attach="material"
          map={bootBottomBarRightTex}
          opacity={bootState.bootOpacity}
        />
      </sprite>
      <sprite scale={[0.2, 0.2, 0]} position={[0, -0.8, 0]}>
        <a.spriteMaterial
          attach="material"
          map={bootPurpleSquareTex}
          opacity={bootState.bootOpacity}
        />
      </sprite>
      <sprite scale={[1.4, 0.5, 0]} position={[-1.2, -1.17, 0]}>
        <a.spriteMaterial
          attach="material"
          map={bootDangoTextTex}
          opacity={bootState.bootOpacity}
        />
      </sprite>
      <sprite scale={[0.6, 0.15, 0]} position={[0.9, -1, 0]}>
        <a.spriteMaterial
          attach="material"
          map={bootMisoShioTex}
          opacity={bootState.bootOpacity}
        />
      </sprite>
      <sprite scale={[0.12, 0.06, 0]} position={[0.5, -0.96, 0]} ref={arrowRef}>
        <a.spriteMaterial
          attach="material"
          map={bootArrowsTex}
          opacity={bootState.bootOpacity}
        />
      </sprite>

      <sprite scale={[1.4, 0.2, 0]} position={[1.15, -1.2, 0]}>
        <a.spriteMaterial
          attach="material"
          map={currentBootStatusTextTex}
          opacity={bootState.bootOpacity}
        />
      </sprite>

      <a.sprite scale={[0.2, 0.2, 0]} position-y={positionState.graySquarePosY}>
        <spriteMaterial
          attach="material"
          map={bootGraySquareTex}
          ref={graySquareRef}
        />
      </a.sprite>
    </>
  );
};

export default BootAnimation;
