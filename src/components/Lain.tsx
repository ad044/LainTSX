import React, { Suspense, useState } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { PlainSingularAnimator } from "three-plain-animator/lib/plain-singular-animator";
import moveDownSpriteSheet from "../static/sprites/jump_down.png";
import moveUpSpriteSheet from "../static/sprites/jump_up.png";
import moveLeftSpriteSheet from "../static/sprites/move_left.png";
import moveRightSpriteSheet from "../static/sprites/move_right.png";
import standingSpriteSheet from "../static/sprites/standing.png";
import introSpriteSheet from "../static/sprites/intro.png";
import throwBlueOrbSpriteSheet from "../static/sprites/throw_blue_orb.png";
import { useLainStore } from "../store";

type LainConstructorProps = {
  sprite: string;
  frameCount: number;
  framesVertical: number;
  framesHorizontal: number;
};

const LainConstructor = (props: LainConstructorProps) => {
  // any here temporarily
  const lainSpriteTexture: any = useLoader(THREE.TextureLoader, props.sprite);

  const [animator] = useState(
    () =>
      new PlainSingularAnimator(
        lainSpriteTexture,
        props.framesHorizontal,
        props.framesVertical,
        props.frameCount,
        props.frameCount * 0.27
      )
  );

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

export const LainThrowBlueOrb = () => {
  return (
    <LainConstructor
      sprite={throwBlueOrbSpriteSheet}
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
    moveLeft: <LainMoveLeft />,
    moveRight: <LainMoveRight />,
    moveUp: <LainMoveUp />,
    moveDown: <LainMoveDown />,
    throwBlueOrb: <LainThrowBlueOrb />,
  };

  return (
    <Suspense fallback={<>loading...</>}>
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
