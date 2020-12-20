import React, { Suspense, useState } from "react";
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
import { useLainStore, useMainSceneStore } from "../../store";

type LainConstructorProps = {
  sprite: string;
  frameCount: number;
  framesVertical: number;
  framesHorizontal: number;
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
      props.frameCount * 0.27
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

const Lain = () => {
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
  };

  return (
    <Suspense fallback={null}>
      <sprite scale={[4.5, 4.5, 4.5]} position={[0, -0.15, 0]}>
        {
          lainAnimationDispatch[
            lainMoveState as keyof typeof lainAnimationDispatch
          ]
        }
      </sprite>
    </Suspense>
  );
};

export default Lain;
