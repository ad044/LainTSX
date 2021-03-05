import React, {useEffect, useMemo, useRef, useState} from "react";
import bootLof from "../../static/sprites/boot/boot_lof.png";
import bootBottomBarLeft from "../../static/sprites/boot/boot_bottom_bar_left.png";
import bootBottomBarRight from "../../static/sprites/boot/boot_bottom_bar_right.png";
import bootPurpleSquare from "../../static/sprites/boot/boot_purple_square.png";
import bootGraySquare from "../../static/sprites/boot/boot_gray_square.png";
import bootDangoText from "../../static/sprites/boot/dango_text.png";
import bootMisoShio from "../../static/sprites/boot/miso_shio.png";
import bootArrows from "../../static/sprites/boot/boot_arrows.png";
import bootStatusTexts from "../../static/sprites/boot/boot_status_texts.png";
import bootBackgroundText from "../../static/sprites/boot/boot_background_text.png";
import bootBackgroundDistortedTex from "../../static/sprites/boot/distorted_text.png";

import {useFrame, useLoader} from "react-three-fiber";
import {a, useSpring} from "@react-spring/three";
import * as THREE from "three";
import sleep from "../../utils/sleep";

type BootAnimationProps = {
  visible: boolean;
  mainMenuVisible: boolean;
  activeSubScene: string;
};

const BootAnimation = (props: BootAnimationProps) => {
  const [
    backgroundFloatingTextShown,
    setBackgroundFloatingTextShown,
  ] = useState(false);

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
  const bootBackgroundTextTex = useLoader(
    THREE.TextureLoader,
    bootBackgroundText
  );
  const bootBackgroundDistortedTextTex = useLoader(
    THREE.TextureLoader,
    bootBackgroundDistortedTex
  );

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

    if (
      backgroundFloatingTextShown &&
      firstBackgroundTextRef.current &&
      sndBackgroundTextRef.current &&
      firstDistortedBackgroundTextRef.current &&
      sndDistortedBackgroundTextRef.current
    ) {
      if (firstBackgroundTextRef.current.position.y > 3.5) {
        firstBackgroundTextRef.current.position.y = -3.5;
        firstBackgroundTextRef.current.position.x = -0.85;
      } else {
        firstBackgroundTextRef.current.position.y += 0.01;
        firstBackgroundTextRef.current.position.x += 0.001;
      }
      if (sndBackgroundTextRef.current.position.y > 3.5) {
        sndBackgroundTextRef.current.position.y = -3.5;
        sndBackgroundTextRef.current.position.x = -0.85;
      } else {
        sndBackgroundTextRef.current.position.y += 0.01;
        sndBackgroundTextRef.current.position.x += 0.001;
      }

      if (firstDistortedBackgroundTextRef.current.position.y > 2.8) {
        firstDistortedBackgroundTextRef.current.position.y = -3;
        firstDistortedBackgroundTextRef.current.position.x = 0;
      } else {
        firstDistortedBackgroundTextRef.current.position.y += 0.025;
        firstDistortedBackgroundTextRef.current.position.x -= 0.013;
      }

      if (sndDistortedBackgroundTextRef.current.position.y > 2.8) {
        sndDistortedBackgroundTextRef.current.position.y = -3;
        sndDistortedBackgroundTextRef.current.position.x = 0;
      } else {
        sndDistortedBackgroundTextRef.current.position.y += 0.025;
        sndDistortedBackgroundTextRef.current.position.x -= 0.013;
      }
    }
  });

  const currentBootStatusTextTex = useMemo(() => {
    bootStatusTextsTex.offset.y = 0.79;
    bootStatusTextsTex.repeat.set(0.5, 0.2);
    return bootStatusTextsTex;
  }, [bootStatusTextsTex]);

  useEffect(() => {
    if (props.visible) {
      (async () => {
        await sleep(900);
        currentBootStatusTextTex.offset.y = 0.528;

        await sleep(300);
        currentBootStatusTextTex.offset.y = 0.79;

        await sleep(300);
        currentBootStatusTextTex.offset.y = 0.264;

        await sleep(100);
        currentBootStatusTextTex.offset.y = 0.79;

        await sleep(500);
        currentBootStatusTextTex.offset.x = 0.5;
        currentBootStatusTextTex.offset.y = 0.264;

        await sleep(300);
        currentBootStatusTextTex.offset.x = 0;
        currentBootStatusTextTex.offset.y = 0.005;

        await sleep(100);
        currentBootStatusTextTex.offset.y = 0.79;
      })();
    }
  }, [bootBackgroundTextTex, currentBootStatusTextTex.offset, props.visible]);

  useEffect(() => {
    if (props.mainMenuVisible) {
      currentBootStatusTextTex.offset.x = 0.5;
      currentBootStatusTextTex.offset.y = 0.005;
      setBootOpacity(0);
      setGraySquarePosY(0);
      setLofPosX(1.3);
      setLofPosY(1);
      setBackgroundFloatingTextShown(true);
    }
  }, [currentBootStatusTextTex.offset, props.mainMenuVisible]);

  const [bootOpacity, setBootOpacity] = useState(1);
  const [graySquarePosY, setGraySquarePosY] = useState(-0.8);
  const [lofPosX, setLofPosX] = useState(0);
  const [lofPosY, setLofPosY] = useState(0);

  const bootState = useSpring({
    bootOpacity: bootOpacity,
    config: { duration: 300 },
  });

  const animationState = useSpring({
    graySquarePosY: graySquarePosY,
    lofPosX: lofPosX,
    lofPosY: lofPosY,
    lofOpacity: props.activeSubScene === "main_menu" ? 1 : 0,
    graySquareOpacity: props.activeSubScene === "main_menu" ? 1 : 0,
    config: { duration: 500 },
  });

  const firstBackgroundTextRef = useRef<THREE.Object3D>();
  const sndBackgroundTextRef = useRef<THREE.Object3D>();
  const firstDistortedBackgroundTextRef = useRef<THREE.Object3D>();
  const sndDistortedBackgroundTextRef = useRef<THREE.Object3D>();

  return (
    <group visible={props.visible}>
      <a.sprite
        scale={[1.2, 0.4, 0]}
        position-x={animationState.lofPosX}
        position-y={animationState.lofPosY}
      >
        <a.spriteMaterial
          attach="material"
          map={bootLofTex}
          opacity={animationState.lofOpacity}
        />
      </a.sprite>
      <a.sprite
        scale={[0.2, 0.2, 0]}
        position-y={animationState.graySquarePosY}
      >
        <a.spriteMaterial
          attach="material"
          map={bootGraySquareTex}
          ref={graySquareRef}
          opacity={animationState.graySquareOpacity}
        />
      </a.sprite>
      {props.activeSubScene !== "authorize_user" && (
        <>
          {/*we have two of each to create looping effect*/}
          <a.sprite
            scale={[1.5, 3.5, 0]}
            renderOrder={-1}
            position={[-0.85, -3.5, 0]}
            ref={firstBackgroundTextRef}
          >
            <spriteMaterial
              attach="material"
              rotation={-0.1}
              map={bootBackgroundTextTex}
              transparent={true}
              opacity={0.6}
            />
          </a.sprite>
          <a.sprite
            scale={[1.5, 3.5, 0]}
            renderOrder={-1}
            position={[-1.2, -7, 0]}
            ref={sndBackgroundTextRef}
          >
            <spriteMaterial
              attach="material"
              rotation={-0.1}
              map={bootBackgroundTextTex}
              transparent={true}
              opacity={0.6}
            />
          </a.sprite>

          <group position={[1, 0, 0]}>
            <a.sprite
              scale={[1, 3.5, 0]}
              renderOrder={-1}
              position={[0, -3.5, 0]}
              ref={firstDistortedBackgroundTextRef}
            >
              <spriteMaterial
                attach="material"
                rotation={0.5}
                map={bootBackgroundDistortedTextTex}
                transparent={true}
              />
            </a.sprite>
            <a.sprite
              scale={[1, 3.5, 0]}
              renderOrder={-1}
              position={[1.55, -6.5, 0]}
              ref={sndDistortedBackgroundTextRef}
            >
              <spriteMaterial
                attach="material"
                rotation={0.5}
                map={bootBackgroundDistortedTextTex}
                transparent={true}
              />
            </a.sprite>
          </group>
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
          <sprite
            scale={[0.2, 0.2, 0]}
            position={[0, -0.8, 0]}
            renderOrder={-1}
          >
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
          <sprite
            scale={[0.12, 0.06, 0]}
            position={[0.5, -0.96, 0]}
            ref={arrowRef}
          >
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
        </>
      )}
    </group>
  );
};

export default BootAnimation;
