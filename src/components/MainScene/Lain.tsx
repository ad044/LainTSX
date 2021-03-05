import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { PlainSingularAnimator } from "three-plain-animator/lib/plain-singular-animator";
import moveDownSpriteSheet from "../../static/sprites/lain/jump_down.png";
import moveUpSpriteSheet from "../../static/sprites/lain/jump_up.png";
import moveLeftSpriteSheet from "../../static/sprites/lain/move_left.png";
import moveRightSpriteSheet from "../../static/sprites/lain/move_right.png";
import standingSpriteSheet from "../../static/sprites/lain/standing.png";
import introSpriteSheet from "../../static/sprites/lain/intro.png";
import throwNodeSpriteSheet from "../../static/sprites/lain/throw_node.png";
import ripMiddleRingSpriteSheet from "../../static/sprites/lain/rip_middle_ring.png";
import knockSpriteSheet from "../../static/sprites/lain/knock.png";
import knockAndFallSpriteSheet from "../../static/sprites/lain/knock_and_fall.png";
import touchAndScareSpriteSheet from "../../static/sprites/lain/touch_node_and_get_scared.png";
import ripNodeSpriteSheet from "../../static/sprites/lain/rip_node.png";
import touchSleeveSpriteSheet from "../../static/sprites/lain/touch_sleeve.png";
import prayerSpriteSheet from "../../static/sprites/lain/prayer.png";
import thinkingSpriteSheet from "../../static/sprites/lain/thinking.png";
import stretchSpriteSheet from "../../static/sprites/lain/stretch.png";
import stretch2SpriteSheet from "../../static/sprites/lain/stretch_2.png";
import spinSpriteSheet from "../../static/sprites/lain/spin.png";
import scratchHeadSpriteSheet from "../../static/sprites/lain/scratch_head.png";
import blushSpriteSheet from "../../static/sprites/lain/blush.png";
import handsBehindHeadSpriteSheet from "../../static/sprites/lain/hands_behind_head.png";
import handsOnHipsSpriteSheet from "../../static/sprites/lain/hands_on_hips.png";
import handsOnHips2SpriteSheet from "../../static/sprites/lain/hands_on_hips_2.png";
import handsTogetherSpriteSheet from "../../static/sprites/lain/hands_together.png";
import leanForwardSpriteSheet from "../../static/sprites/lain/lean_forward.png";
import leanLeftSpriteSheet from "../../static/sprites/lain/lean_left.png";
import leanRightSpriteSheet from "../../static/sprites/lain/lean_right.png";
import lookAroundSpriteSheet from "../../static/sprites/lain/look_around.png";
import playWithHairSpriteSheet from "../../static/sprites/lain/play_with_hair.png";

import { useStore } from "../../store";

type LainConstructorProps = {
  sprite: string;
  frameCount: number;
  framesVertical: number;
  framesHorizontal: number;
  fps?: number;
  shouldAnimate?: boolean;
};

export const LainConstructor = (props: LainConstructorProps) => {
  const lainSpriteTexture: any = useLoader(THREE.TextureLoader, props.sprite);

  const [animator] = useState(() => {
    const anim = new PlainSingularAnimator(
      lainSpriteTexture,
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
    <spriteMaterial
      attach="material"
      map={lainSpriteTexture}
      alphaTest={0.665}
      color={0xffffff}
    />
  );
};

export const LainIntro = (props: { shouldAnimate: boolean }) => (
  <LainConstructor
    sprite={introSpriteSheet}
    frameCount={3}
    framesHorizontal={3}
    framesVertical={1}
    fps={10}
    shouldAnimate={props.shouldAnimate}
  />
);

export const LainStanding = () => (
  <LainConstructor
    sprite={standingSpriteSheet}
    frameCount={1}
    framesHorizontal={1}
    framesVertical={1}
  />
);

export const LainMoveDown = () => (
  <LainConstructor
    sprite={moveDownSpriteSheet}
    frameCount={36}
    framesHorizontal={6}
    framesVertical={6}
  />
);

export const LainMoveLeft = () => (
  <LainConstructor
    sprite={moveLeftSpriteSheet}
    frameCount={46}
    framesHorizontal={7}
    framesVertical={7}
    fps={0.28 * 46}
  />
);

export const LainMoveRight = () => (
  <LainConstructor
    sprite={moveRightSpriteSheet}
    frameCount={46}
    framesHorizontal={7}
    framesVertical={7}
    fps={0.28 * 46}
  />
);

export const LainMoveUp = () => (
  <LainConstructor
    sprite={moveUpSpriteSheet}
    frameCount={36}
    framesHorizontal={6}
    framesVertical={6}
  />
);

export const LainThrowNode = () => (
  <LainConstructor
    sprite={throwNodeSpriteSheet}
    frameCount={47}
    framesHorizontal={7}
    framesVertical={7}
  />
);

export const LainRipMiddleRing = () => (
  <LainConstructor
    sprite={ripMiddleRingSpriteSheet}
    frameCount={53}
    framesHorizontal={8}
    framesVertical={7}
  />
);

export const LainKnock = () => (
  <LainConstructor
    sprite={knockSpriteSheet}
    frameCount={30}
    framesHorizontal={6}
    framesVertical={5}
    fps={30 * 0.35}
  />
);

export const LainKnockAndFall = () => (
  <LainConstructor
    sprite={knockAndFallSpriteSheet}
    frameCount={62}
    framesHorizontal={8}
    framesVertical={8}
    fps={62 * 0.17}
  />
);

export const LainTouchAndScare = () => (
  <LainConstructor
    sprite={touchAndScareSpriteSheet}
    frameCount={37}
    framesHorizontal={7}
    framesVertical={6}
  />
);

export const LainRipNode = () => (
  <LainConstructor
    sprite={ripNodeSpriteSheet}
    frameCount={60}
    framesHorizontal={8}
    framesVertical={8}
    fps={60 * 0.17}
  />
);

export const LainPrayer = () => (
  <LainConstructor
    sprite={prayerSpriteSheet}
    frameCount={32}
    framesHorizontal={6}
    framesVertical={6}
    fps={32 * 0.3}
  />
);

export const LainTouchSleeve = () => (
  <LainConstructor
    sprite={touchSleeveSpriteSheet}
    frameCount={33}
    framesHorizontal={6}
    framesVertical={6}
    fps={33 * 0.35}
  />
);

export const LainThinking = () => (
  <LainConstructor
    sprite={thinkingSpriteSheet}
    frameCount={38}
    framesHorizontal={7}
    framesVertical={6}
  />
);

export const LainStretch2 = () => (
  <LainConstructor
    sprite={stretch2SpriteSheet}
    frameCount={34}
    framesHorizontal={6}
    framesVertical={6}
  />
);

export const LainStretch = () => (
  <LainConstructor
    sprite={stretchSpriteSheet}
    frameCount={23}
    framesHorizontal={5}
    framesVertical={5}
    fps={23 * 0.35}
  />
);

export const LainSpin = () => (
  <LainConstructor
    sprite={spinSpriteSheet}
    frameCount={27}
    framesHorizontal={6}
    framesVertical={5}
    fps={27 * 0.35}
  />
);

export const LainScratchHead = () => (
  <LainConstructor
    sprite={scratchHeadSpriteSheet}
    frameCount={35}
    framesHorizontal={6}
    framesVertical={6}
  />
);

export const LainBlush = () => (
  <LainConstructor
    sprite={blushSpriteSheet}
    frameCount={28}
    framesHorizontal={6}
    framesVertical={5}
    fps={28 * 0.35}
  />
);

export const LainHandsBehindHead = () => (
  <LainConstructor
    sprite={handsBehindHeadSpriteSheet}
    frameCount={21}
    framesHorizontal={5}
    framesVertical={5}
    fps={28 * 0.35}
  />
);

export const LainHandsOnHips = () => (
  <LainConstructor
    sprite={handsOnHipsSpriteSheet}
    frameCount={27}
    framesHorizontal={6}
    framesVertical={5}
    fps={28 * 0.35}
  />
);

export const LainHandsOnHips2 = () => (
  <LainConstructor
    sprite={handsOnHips2SpriteSheet}
    frameCount={35}
    framesHorizontal={6}
    framesVertical={6}
  />
);

export const LainLeanForward = () => (
  <LainConstructor
    sprite={leanForwardSpriteSheet}
    frameCount={25}
    framesHorizontal={5}
    framesVertical={5}
    fps={28 * 0.35}
  />
);

export const LainHandsTogether = () => (
  <LainConstructor
    sprite={handsTogetherSpriteSheet}
    frameCount={23}
    framesHorizontal={5}
    framesVertical={5}
    fps={28 * 0.35}
  />
);

export const LainLeanLeft = () => (
  <LainConstructor
    sprite={leanLeftSpriteSheet}
    frameCount={29}
    framesHorizontal={6}
    framesVertical={5}
    fps={32 * 0.35}
  />
);

export const LainLeanRight = () => (
  <LainConstructor
    sprite={leanRightSpriteSheet}
    frameCount={52}
    framesHorizontal={8}
    framesVertical={7}
    fps={45 * 0.35}
  />
);

export const LainLookAround = () => (
  <LainConstructor
    sprite={lookAroundSpriteSheet}
    frameCount={35}
    framesHorizontal={6}
    framesVertical={6}
    fps={35 * 0.35}
  />
);

export const LainPlayWithHair = () => (
  <LainConstructor
    sprite={playWithHairSpriteSheet}
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
  const lainMoveState = useStore((state) => state.lainMoveState);

  const wordSelected = useStore((state) => state.wordSelected);

  const lainAnimationDispatch = useMemo(() => {
    const anims = {
      standing: <LainStanding />,
      move_left: <LainMoveLeft />,
      move_right: <LainMoveRight />,
      jump_up: <LainMoveUp />,
      jump_down: <LainMoveDown />,
      knock_and_fall: <LainKnockAndFall />,
      touch_node_and_get_scared: <LainTouchAndScare />,
      knock: <LainKnock />,
      select_level_down: <LainMoveDown />,
      select_level_up: <LainMoveUp />,
      throw_node: <LainThrowNode />,
      rip_middle_ring: <LainRipMiddleRing />,
      rip_node: <LainRipNode />,
      prayer: <LainPrayer />,
      scratch_head: <LainScratchHead />,
      spin: <LainSpin />,
      stretch: <LainStretch />,
      stretch_2: <LainStretch2 />,
      thinking: <LainThinking />,
      touch_sleeve: <LainTouchSleeve />,
      blush: <LainBlush />,
      hands_behind_head: <LainHandsBehindHead />,
      hands_on_hips: <LainHandsOnHips />,
      hands_on_hips_2: <LainHandsOnHips2 />,
      hands_together: <LainHandsTogether />,
      lean_forward: <LainLeanForward />,
      lean_left: <LainLeanLeft />,
      lean_right: <LainLeanRight />,
      look_around: <LainLookAround />,
      play_with_hair: <LainPlayWithHair />,
    };

    return anims[lainMoveState as keyof typeof anims];
  }, [lainMoveState]);

  const lainRef = useRef<THREE.Sprite>();

  const glowColor = useMemo(() => new THREE.Color(2, 2, 2), []);
  const regularColor = useMemo(() => new THREE.Color(1, 1, 1), []);

  useEffect(() => {
    if (wordSelected) {
      setTimeout(() => {
        if (lainRef.current) lainRef.current.material.color = glowColor;
      }, 3100);
    }
  }, [glowColor, wordSelected]);

  useFrame(() => {
    if (lainRef.current) {
      lainRef.current.material.color.lerp(regularColor, 0.07);
    }
  });

  return (
    <Suspense fallback={null}>
      <sprite scale={[4.5, 4.5, 4.5]} position={[0, -0.15, 0]} ref={lainRef}>
        {props.introFinished ? (
          lainAnimationDispatch
        ) : (
          <LainIntro shouldAnimate={props.shouldAnimate} />
        )}
      </sprite>
    </Suspense>
  );
};

export default Lain;
