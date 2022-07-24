import React, { useEffect, useMemo, useRef, useState } from "react";

import { useFrame } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";
import sleep from "@/utils/sleep";
import { useStore } from "@/store";
import { BootSubscene, Position } from "@/types";
import { useTexture } from "@react-three/drei";
import { RepeatWrapping } from "three";

type BootAnimationProps = {
  visible: boolean;
  mainMenuVisible: boolean;
};

type BootAnimationSpring = {
  position: Position;
  opacity: number;
};

const BootAnimation = (props: BootAnimationProps) => {
  const subscene = useStore((state) => state.bootSubscene);

  const [bgTextVisible, setBgTextVisible] = useState(false);

  const lof = useTexture("/sprites/boot/boot_lof.png");
  const bottomBarLeft = useTexture("/sprites/boot/boot_bottom_bar_left.png");
  const bootBottomBarRight = useTexture(
    "/sprites/boot/boot_bottom_bar_right.png"
  );
  const purpleSquare = useTexture("/sprites/boot/boot_purple_square.png");
  const graySquare = useTexture("/sprites/boot/boot_gray_square.png");
  const dangoText = useTexture("/sprites/boot/dango_text.png");
  const misoShio = useTexture("/sprites/boot/miso_shio.png");
  const arrows = useTexture("/sprites/boot/boot_arrows.png");
  const statusTexts = useTexture("/sprites/boot/boot_status_texts.png");
  const bgText = useTexture("/sprites/boot/boot_background_text.png");

  const bgTextWithWrapping = useMemo(() => {
    bgText.wrapS = bgText.wrapT = RepeatWrapping;
    return bgText;
  }, [bgText]);

  const graySquareRef = useRef<THREE.SpriteMaterial>(null);
  const arrowRef = useRef<THREE.Sprite>(null);

  useFrame((_, delta) => {
    if (graySquareRef.current) {
      graySquareRef.current.rotation -= delta * 5;
    }
    if (arrowRef.current && Date.now() % 5 === 0) {
      arrowRef.current.position.y =
        arrowRef.current.position.y === -1.04 ? -0.96 : -1.04;
    }

    if (bgTextVisible) {
      bgTextWithWrapping.offset.y -= 0.2 * delta;
    }
  });

  const currentBootStatusText = useMemo(() => {
    statusTexts.offset.y = 0.79;
    statusTexts.repeat.set(0.5, 0.2);
    return statusTexts;
  }, [statusTexts]);

  useEffect(() => {
    if (props.visible) {
      (async () => {
        await sleep(900);
        currentBootStatusText.offset.y = 0.528;

        await sleep(300);
        currentBootStatusText.offset.y = 0.79;

        await sleep(300);
        currentBootStatusText.offset.y = 0.264;

        await sleep(100);
        currentBootStatusText.offset.y = 0.79;

        await sleep(500);
        currentBootStatusText.offset.x = 0.5;
        currentBootStatusText.offset.y = 0.264;

        await sleep(300);
        currentBootStatusText.offset.x = 0;
        currentBootStatusText.offset.y = 0.005;

        await sleep(100);
        currentBootStatusText.offset.y = 0.79;
      })();
    }
  }, [currentBootStatusText.offset, props.visible]);

  useEffect(() => {
    if (props.mainMenuVisible) {
      currentBootStatusText.offset.x = 0.5;
      currentBootStatusText.offset.y = 0.005;
      setBgTextVisible(true);
    }
  }, [currentBootStatusText.offset, props.mainMenuVisible]);

  const bootSpring = useSpring({
    opacity: props.mainMenuVisible ? 0 : 1,
    config: { duration: 300 },
  });

  const lofSpring = useSpring<BootAnimationSpring>({
    position: props.mainMenuVisible ? [1.3, 1, 0] : [0, 0, 0],
    opacity: subscene === BootSubscene.MainMenu ? 1 : 0,
    config: { duration: 500 },
  });

  const graySquareSpring = useSpring<BootAnimationSpring>({
    position: props.mainMenuVisible ? [0, 0, 0] : [0, -0.8, 0],
    opacity: subscene === BootSubscene.MainMenu ? 1 : 0,
    config: { duration: 500 },
  });

  return (
    <group visible={props.visible}>
      <a.sprite scale={[1.2, 0.4, 0]} position={lofSpring.position}>
        {/* @ts-ignore: https://github.com/pmndrs/react-spring/issues/1515 */}
        <a.spriteMaterial map={lof} opacity={lofSpring.opacity} />
      </a.sprite>
      <a.sprite scale={[0.2, 0.2, 0]} position={graySquareSpring.position}>
        <a.spriteMaterial
          map={graySquare}
          ref={graySquareRef}
          opacity={graySquareSpring.opacity}
        />
      </a.sprite>
      {subscene !== BootSubscene.AuthorizeUser && (
        <>
          <group visible={bgTextVisible}>
            <a.sprite
              scale={[1.5, 3.5, 0]}
              renderOrder={-1}
              position={[-0.5, 0, 0]}
            >
              <spriteMaterial
                rotation={-0.1}
                map={bgTextWithWrapping}
                transparent={true}
                opacity={0.6}
              />
            </a.sprite>
            <a.sprite
              scale={[1, 5, 0]}
              renderOrder={-1}
              position={[-0.5, 0, 0]}
            >
              <spriteMaterial
                rotation={0.5}
                map={bgTextWithWrapping}
                transparent={true}
                opacity={0.6}
              />
            </a.sprite>
          </group>
          <sprite scale={[2.2, 0.66, 0]} position={[-1.1, -0.8, 0]}>
            <a.spriteMaterial
              map={bottomBarLeft}
              opacity={bootSpring.opacity}
            />
          </sprite>
          <sprite scale={[2.2, 0.66, 0]} position={[1.1, -0.8, 0]}>
            <a.spriteMaterial
              map={bootBottomBarRight}
              opacity={bootSpring.opacity}
            />
          </sprite>
          <sprite
            scale={[0.2, 0.2, 0]}
            position={[0, -0.8, 0]}
            renderOrder={-1}
          >
            <a.spriteMaterial map={purpleSquare} opacity={bootSpring.opacity} />
          </sprite>
          <sprite scale={[1.4, 0.5, 0]} position={[-1.2, -1.17, 0]}>
            <a.spriteMaterial map={dangoText} opacity={bootSpring.opacity} />
          </sprite>
          <sprite scale={[0.6, 0.15, 0]} position={[0.9, -1, 0]}>
            <a.spriteMaterial map={misoShio} opacity={bootSpring.opacity} />
          </sprite>
          <sprite
            scale={[0.12, 0.06, 0]}
            position={[0.5, -0.96, 0]}
            ref={arrowRef}
          >
            <a.spriteMaterial map={arrows} opacity={bootSpring.opacity} />
          </sprite>

          <sprite scale={[1.4, 0.2, 0]} position={[1.15, -1.2, 0]}>
            <a.spriteMaterial
              map={currentBootStatusText}
              opacity={bootSpring.opacity}
            />
          </sprite>
        </>
      )}
    </group>
  );
};

export default BootAnimation;
