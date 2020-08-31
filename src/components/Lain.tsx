import { a, Interpolation } from "@react-spring/three";
import React, { Suspense, useState } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { PlainSingularAnimator } from "three-plain-animator/lib/plain-singular-animator";
import moveDownSpriteSheet from "../static/sprites/jump_down.png";
import moveUpSpriteSheet from "../static/sprites/jump_up.png";
import moveLeftSpriteSheet from "../static/sprites/move_left.png";
import moveRightSpriteSheet from "../static/sprites/move_right.png";
import standingSpriteSheet from "../static/sprites/standing.png";

type LainProps = {
  isLainMoving: boolean;
  lainMoveState: JSX.Element;
  lainPosY: Interpolation<number, number>;
};

type LainConstructorProps = {
  sprite: string;
  frameCount: number;
  framesVertical: number;
  framesHorizontal: number;
};

const LainConstructor = (props: LainConstructorProps) => {
  // any here temporarily
  const spriteTexture: any = useLoader(THREE.TextureLoader, props.sprite);

  const [animator] = useState(
    () =>
      new PlainSingularAnimator(
        spriteTexture,
        props.framesHorizontal,
        props.framesVertical,
        props.frameCount,
        props.frameCount * 0.27
      )
  );

  useFrame(() => {
    animator.animate();
  });

  return <spriteMaterial attach="material" map={spriteTexture} />;
};

export const LainIntro = () => {
  return (
    <LainConstructor
      sprite={standingSpriteSheet}
      frameCount={1}
      framesHorizontal={8}
      framesVertical={6}
    />
  );
};

export const LainStanding = () => {
  return (
    <LainConstructor
      sprite={standingSpriteSheet}
      frameCount={3}
      framesHorizontal={3}
      framesVertical={1}
    />
  );
};

export const LainMoveDown = () => {
  return (
    <LainConstructor
      sprite={moveDownSpriteSheet}
      frameCount={36}
      framesHorizontal={6}
      framesVertical={6}
    />
  );
};

export const LainMoveLeft = () => {
  return (
    <LainConstructor
      sprite={moveLeftSpriteSheet}
      frameCount={47}
      framesHorizontal={8}
      framesVertical={6}
    />
  );
};

export const LainMoveRight = () => {
  return (
    <LainConstructor
      sprite={moveRightSpriteSheet}
      frameCount={47}
      framesHorizontal={8}
      framesVertical={6}
    />
  );
};

export const LainMoveUp = () => {
  return (
    <LainConstructor
      sprite={moveUpSpriteSheet}
      frameCount={36}
      framesHorizontal={6}
      framesVertical={6}
    />
  );
};

const Lain = (props: LainProps) => {
  return (
    <Suspense fallback={<>loading...</>}>
      <a.sprite
        position-x={0.1}
        position-y={props.lainPosY}
        scale={[4.9, 4.9, 4.9]}
      >
        {props.isLainMoving ? props.lainMoveState : <LainStanding />}
      </a.sprite>
    </Suspense>
  );
};

export default Lain;
