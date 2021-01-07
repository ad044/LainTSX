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
import { useLainStore, useMainSceneStore } from "../../store";

type LainConstructorProps = {
  sprite: string;
  frameCount: number;
  framesVertical: number;
  framesHorizontal: number;
  fps?: number;
};

export const LainConstructor = (props: LainConstructorProps) => {
  // any here temporarily
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
    frameCount={3}
    framesHorizontal={3}
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
    frameCount={47}
    framesHorizontal={8}
    framesVertical={6}
  />
);

export const LainMoveRight = () => (
  <LainConstructor
    sprite={moveRightSpriteSheet}
    frameCount={47}
    framesHorizontal={8}
    framesVertical={6}
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

export const LainThrowNode = () => {
  return (
    <LainConstructor
      sprite={throwNodeSpriteSheet}
      frameCount={47}
      framesHorizontal={7}
      framesVertical={7}
    />
  );
};

export const LainRipMiddleRing = () => {
  return (
    <LainConstructor
      sprite={ripMiddleRingSpriteSheet}
      frameCount={53}
      framesHorizontal={8}
      framesVertical={7}
    />
  );
};

export const LainKnock = () => {
  return (
    <LainConstructor
      sprite={knockSpriteSheet}
      frameCount={32}
      framesHorizontal={6}
      framesVertical={6}
    />
  );
};

export const LainKnockAndFall = () => {
  return (
    <LainConstructor
      sprite={knockAndFallSpriteSheet}
      frameCount={64}
      framesHorizontal={8}
      framesVertical={8}
      fps={64 * 0.17}
    />
  );
};

export const LainTouchAndScare = () => {
  return (
    <LainConstructor
      sprite={touchAndScareSpriteSheet}
      frameCount={37}
      framesHorizontal={7}
      framesVertical={6}
    />
  );
};

export const LainRipNode = () => {
  return (
    <LainConstructor
      sprite={ripNodeSpriteSheet}
      frameCount={60}
      framesHorizontal={8}
      framesVertical={8}
      fps={60 * 0.17}
    />
  );
};

type LainProps = {
  shouldIntro: boolean;
};

const Lain = (props: LainProps) => {
  const lainMoveState = useLainStore((state) => state.lainMoveState);

  const lainAnimationDispatch = {
    standing: <LainStanding />,
    site_left: <LainMoveLeft />,
    site_right: <LainMoveRight />,
    site_up: <LainMoveUp />,
    site_down: <LainMoveDown />,
    select_level_down: <LainMoveDown />,
    select_level_up: <LainMoveUp />,
    throw_node: <LainThrowNode />,
    pause_game: <LainRipMiddleRing />,
    test: <LainRipNode />,
  };

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
        {stopIntroAnim ? (
          lainAnimationDispatch[
            lainMoveState as keyof typeof lainAnimationDispatch
          ]
        ) : (
          <LainIntro />
        )}
      </sprite>
    </Suspense>
  );
};

export default Lain;
