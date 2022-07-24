import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { PlainSingularAnimator } from "three-plain-animator/lib/plain-singular-animator";

import { useStore } from "@/store";
import usePrevious from "@/hooks/usePrevious";
import { LainAnimation, MainSubscene } from "@/types";
import { Color } from "three";
import { useTexture } from "@react-three/drei";

type LainConstructorProps = {
  texture: THREE.Texture;
  frameCount: number;
  framesVertical: number;
  framesHorizontal: number;
  fps?: number;
  shouldAnimate?: boolean;
};

export const LainConstructor = (props: LainConstructorProps) => {
  const [animator] = useState(() => {
    const anim = new PlainSingularAnimator(
      props.texture,
      props.framesHorizontal,
      props.framesVertical,
      props.frameCount,
      props.fps ? props.fps : props.frameCount * 0.27
    );
    anim.init(0);
    return anim;
  });

  useFrame(() => {
    if (props.shouldAnimate !== false) {
      animator.animate();
    }
  });

  return (
    <spriteMaterial map={props.texture} alphaTest={0.665} color={0xffffff} />
  );
};

export const LainIntro = (props: { shouldAnimate: boolean }) => (
  <LainConstructor
    texture={useTexture("/sprites/lain/intro.png")}
    frameCount={3}
    framesHorizontal={3}
    framesVertical={1}
    fps={10}
    shouldAnimate={props.shouldAnimate}
  />
);

export const LainStanding = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/standing.png")}
    frameCount={1}
    framesHorizontal={1}
    framesVertical={1}
  />
);

export const LainMoveDown = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/jump_down.png")}
    frameCount={36}
    framesHorizontal={6}
    framesVertical={6}
  />
);

export const LainMoveLeft = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/move_left.png")}
    frameCount={46}
    framesHorizontal={7}
    framesVertical={7}
    fps={0.28 * 46}
  />
);

export const LainMoveRight = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/move_right.png")}
    frameCount={46}
    framesHorizontal={7}
    framesVertical={7}
    fps={0.28 * 46}
  />
);

export const LainMoveUp = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/jump_up.png")}
    frameCount={36}
    framesHorizontal={6}
    framesVertical={6}
  />
);

export const LainThrowNode = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/throw_node.png")}
    frameCount={47}
    framesHorizontal={7}
    framesVertical={7}
  />
);

export const LainRipMiddleRing = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/rip_middle_ring.png")}
    frameCount={53}
    framesHorizontal={8}
    framesVertical={7}
  />
);

export const LainKnock = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/knock.png")}
    frameCount={30}
    framesHorizontal={6}
    framesVertical={5}
    fps={30 * 0.35}
  />
);

export const LainKnockAndFall = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/knock_and_fall.png")}
    frameCount={62}
    framesHorizontal={8}
    framesVertical={8}
    fps={62 * 0.17}
  />
);

export const LainTouchAndScare = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/touch_node_and_get_scared.png")}
    frameCount={37}
    framesHorizontal={7}
    framesVertical={6}
  />
);

export const LainRipNode = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/rip_node.png")}
    frameCount={60}
    framesHorizontal={8}
    framesVertical={8}
    fps={60 * 0.17}
  />
);

export const LainPrayer = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/prayer.png")}
    frameCount={32}
    framesHorizontal={6}
    framesVertical={6}
    fps={32 * 0.3}
  />
);

export const LainTouchSleeve = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/touch_sleeve.png")}
    frameCount={33}
    framesHorizontal={6}
    framesVertical={6}
    fps={33 * 0.35}
  />
);

export const LainThinking = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/thinking.png")}
    frameCount={38}
    framesHorizontal={7}
    framesVertical={6}
  />
);

export const LainStretch2 = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/stretch_2.png")}
    frameCount={34}
    framesHorizontal={6}
    framesVertical={6}
  />
);

export const LainStretch = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/stretch.png")}
    frameCount={23}
    framesHorizontal={5}
    framesVertical={5}
    fps={23 * 0.35}
  />
);

export const LainSpin = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/spin.png")}
    frameCount={27}
    framesHorizontal={6}
    framesVertical={5}
    fps={27 * 0.35}
  />
);

export const LainScratchHead = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/scratch_head.png")}
    frameCount={35}
    framesHorizontal={6}
    framesVertical={6}
  />
);

export const LainBlush = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/blush.png")}
    frameCount={28}
    framesHorizontal={6}
    framesVertical={5}
    fps={28 * 0.35}
  />
);

export const LainHandsBehindHead = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/hands_behind_head.png")}
    frameCount={21}
    framesHorizontal={5}
    framesVertical={5}
    fps={28 * 0.35}
  />
);

export const LainHandsOnHips = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/hands_on_hips.png")}
    frameCount={27}
    framesHorizontal={6}
    framesVertical={5}
    fps={28 * 0.35}
  />
);

export const LainHandsOnHips2 = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/hands_on_hips_2.png")}
    frameCount={35}
    framesHorizontal={6}
    framesVertical={6}
  />
);

export const LainLeanForward = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/lean_forward.png")}
    frameCount={25}
    framesHorizontal={5}
    framesVertical={5}
    fps={28 * 0.35}
  />
);

export const LainHandsTogether = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/hands_together.png")}
    frameCount={23}
    framesHorizontal={5}
    framesVertical={5}
    fps={28 * 0.35}
  />
);

export const LainLeanLeft = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/lean_left.png")}
    frameCount={29}
    framesHorizontal={6}
    framesVertical={5}
    fps={32 * 0.35}
  />
);

export const LainLeanRight = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/lean_right.png")}
    frameCount={52}
    framesHorizontal={8}
    framesVertical={7}
    fps={45 * 0.35}
  />
);

export const LainLookAround = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/look_around.png")}
    frameCount={35}
    framesHorizontal={6}
    framesVertical={6}
    fps={35 * 0.35}
  />
);

export const LainPlayWithHair = () => (
  <LainConstructor
    texture={useTexture("/sprites/lain/play_with_hair.png")}
    frameCount={33}
    framesHorizontal={6}
    framesVertical={6}
    fps={35 * 0.35}
  />
);

type LainProps = {
  shouldAnimate: boolean;
  introFinished: boolean;
};

const Lain = (props: LainProps) => {
  const animation = useStore((state) => state.lainAnimation);

  const wordSelected = useStore((state) => state.wordSelected);

  const animationToComponent = useMemo(
    () => ({
      [LainAnimation.Standing]: <LainStanding />,
      [LainAnimation.MoveLeft]: <LainMoveLeft />,
      [LainAnimation.MoveRight]: <LainMoveRight />,
      [LainAnimation.JumpUp]: <LainMoveUp />,
      [LainAnimation.JumpDown]: <LainMoveDown />,
      [LainAnimation.KnockAndFall]: <LainKnockAndFall />,
      [LainAnimation.TouchNodeAndGetScared]: <LainTouchAndScare />,
      [LainAnimation.Knock]: <LainKnock />,
      [LainAnimation.SelectLevelDown]: <LainMoveDown />,
      [LainAnimation.SelectLevelUp]: <LainMoveUp />,
      [LainAnimation.ThrowNode]: <LainThrowNode />,
      [LainAnimation.RipMiddleRing]: <LainRipMiddleRing />,
      [LainAnimation.RipNode]: <LainRipNode />,
      [LainAnimation.Prayer]: <LainPrayer />,
      [LainAnimation.ScratchHead]: <LainScratchHead />,
      [LainAnimation.Spin]: <LainSpin />,
      [LainAnimation.Stretch]: <LainStretch />,
      [LainAnimation.Stretch2]: <LainStretch2 />,
      [LainAnimation.Thinking]: <LainThinking />,
      [LainAnimation.TouchSleeve]: <LainTouchSleeve />,
      [LainAnimation.Blush]: <LainBlush />,
      [LainAnimation.HandsBehindHead]: <LainHandsBehindHead />,
      [LainAnimation.HandsOnHips]: <LainHandsOnHips />,
      [LainAnimation.HandsOnHips2]: <LainHandsOnHips2 />,
      [LainAnimation.HandsTogether]: <LainHandsTogether />,
      [LainAnimation.LeanForward]: <LainLeanForward />,
      [LainAnimation.LeanLeft]: <LainLeanLeft />,
      [LainAnimation.LeanRight]: <LainLeanRight />,
      [LainAnimation.LookAround]: <LainLookAround />,
      [LainAnimation.PlayWithHair]: <LainPlayWithHair />,
    }),
    []
  );

  const lainRef = useRef<THREE.Sprite>(null);

  const glowColor = useMemo(() => new Color(2, 2, 2), []);
  const regularColor = useMemo(() => new Color(1, 1, 1), []);

  useEffect(() => {
    if (wordSelected) {
      setTimeout(() => {
        if (lainRef.current) lainRef.current.material.color = glowColor;
      }, 3100);
    }
  }, [glowColor, wordSelected]);

  useFrame((_, delta) => {
    if (lainRef.current) {
      lainRef.current.material.color.lerp(regularColor, 4 * delta);
    }
  });

  const subscene = useStore((state) => state.mainSubscene);
  const prev = usePrevious({ subscene });

  useEffect(() => {
    if (subscene === MainSubscene.Pause) {
      setTimeout(() => {
        if (lainRef.current) {
          lainRef.current.material.depthTest = false;
          lainRef.current.renderOrder = 2;
        }
      }, 3400);
    } else if (
      prev?.subscene === MainSubscene.Pause &&
      subscene === MainSubscene.Site
    ) {
      if (lainRef.current) {
        lainRef.current.material.depthTest = true;
        lainRef.current.renderOrder = 0;
      }
    }
  }, [prev?.subscene, subscene]);

  return (
    <Suspense fallback={null}>
      <sprite scale={[4.5, 4.5, 4.5]} position={[0, -0.15, 0]} ref={lainRef}>
        {props.introFinished ? (
          animationToComponent[animation]
        ) : (
          <LainIntro shouldAnimate={props.shouldAnimate} />
        )}
      </sprite>
    </Suspense>
  );
};

export default Lain;
