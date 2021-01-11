import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { PlainSingularAnimator } from "three-plain-animator/lib/plain-singular-animator";
import moveDownSpriteSheet from "../../static/sprite/jump_down.png";
import moveUpSpriteSheet from "../../static/sprite/jump_up.png";
import moveLeftSpriteSheet from "../../static/sprite/move_left.png";
import moveRightSpriteSheet from "../../static/sprite/move_right.png";
import standingSpriteSheet from "../../static/sprite/standing.png";
import introSpriteSheet from "../../static/sprite/intro.png";
import throwNodeSpriteSheet from "../../static/sprite/throw_node.png";
import ripMiddleRingSpriteSheet from "../../static/sprite/rip_middle_ring.png";
import knockSpriteSheet from "../../static/sprite/knock.png";
import knockAndFallSpriteSheet from "../../static/sprite/knock_and_fall.png";
import touchAndScareSpriteSheet from "../../static/sprite/touch_and_scare.png";
import ripNodeSpriteSheet from "../../static/sprite/rip_node.png";
import touchSleeveSpriteSheet from "../../static/sprite/touch_sleeve.png";
import prayerSpriteSheet from "../../static/sprite/prayer.png";
import thinkingSpriteSheet from "../../static/sprite/thinking.png";
import stretchSpriteSheet from "../../static/sprite/stretch.png";
import stretch2SpriteSheet from "../../static/sprite/stretch_2.png";
import spinSpriteSheet from "../../static/sprite/spin.png";
import scratchHeadSpriteSheet from "../../static/sprite/scratch_head.png";
import blushSpriteSheet from "../../static/sprite/blush.png";
import handsBehindHeadSpriteSheet from "../../static/sprite/hands_behind_head.png";
import handsOnHipsSpriteSheet from "../../static/sprite/hands_on_hips.png";
import handsOnHips2SpriteSheet from "../../static/sprite/hands_on_hips_2.png";
import handsTogetherSpriteSheet from "../../static/sprite/hands_together.png";
import leanForwardSpriteSheet from "../../static/sprite/lean_forward.png";
import leanLeftSpriteSheet from "../../static/sprite/lean_left.png";
import leanRightSpriteSheet from "../../static/sprite/lean_right.png";
import lookAroundSpriteSheet from "../../static/sprite/look_around.png";
import playWithHairSpriteSheet from "../../static/sprite/play_with_hair.png";

import { useLainStore } from "../../store";

type LainConstructorProps = {
  sprite: string;
  frameCount: number;
  framesVertical: number;
  framesHorizontal: number;
  fps?: number;
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
    animator.animate();
  });

  return (
    <spriteMaterial
      attach="material"
      map={lainSpriteTexture}
      alphaTest={0.01}
    />
  );
};

export const LainIntro = () => (
  <LainConstructor
    sprite={introSpriteSheet}
    frameCount={50}
    framesHorizontal={10}
    framesVertical={5}
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
    frameCount={32}
    framesHorizontal={6}
    framesVertical={6}
  />
);

export const LainKnockAndFall = () => (
  <LainConstructor
    sprite={knockAndFallSpriteSheet}
    frameCount={64}
    framesHorizontal={8}
    framesVertical={8}
    fps={64 * 0.17}
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
  shouldIntro: boolean;
};

const Lain = (props: LainProps) => {
  const lainMoveState = useLainStore((state) => state.lainMoveState);

  const lainAnimationDispatch = useMemo(() => {
    const anims = {
      standing: <LainStanding />,
      site_left: <LainMoveLeft />,
      site_right: <LainMoveRight />,
      site_up: <LainMoveUp />,
      site_down: <LainMoveDown />,
      select_level_down: <LainMoveDown />,
      select_level_up: <LainMoveUp />,
      throw_node: <LainThrowNode />,
      pause_game: <LainRipMiddleRing />,
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

  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIntroFinished(true);
    }, 3900);
  }, []);

  const stopIntroAnim = useMemo(() => {
    return props.shouldIntro ? introFinished : true;
  }, [introFinished, props.shouldIntro]);

  return (
    <Suspense fallback={null}>
      <sprite scale={[4.5, 4.5, 4.5]} position={[0, -0.15, 0]}>
        {stopIntroAnim ? lainAnimationDispatch : <LainIntro />}
      </sprite>
    </Suspense>
  );
};

export default Lain;
