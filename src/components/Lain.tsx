import React, { useCallback, Suspense, useEffect, useState } from "react";
import { useFrame, useLoader, useThree } from "react-three-fiber";
import * as THREE from "three";
import introSpriteSheet from "../static/sprites/intro.png";
import moveDownSpriteSheet from "../static/sprites/jump_down.png";
import standingSpriteSheet from "../static/sprites/standing.png";
import moveLeftSpriteSheet from "../static/sprites/move_left1.png";
import moveRightSpriteSheet from "../static/sprites/move_right.png";
import moveUpSpriteSheet from "../static/sprites/jump_up.png";
import { PlainSingularAnimator } from "three-plain-animator/lib/plain-singular-animator";

type LainProps = {
  isLainMoving: boolean;
  lainMoveState: JSX.Element;
};

type LainConstructorProps = {
  sprite: string;
  frameCount: number;
};

const LainConstructor = (props: LainConstructorProps) => {
  // any here temporarily
  const spriteTexture: any = useLoader(
    THREE.TextureLoader,
    props.sprite
  );

  const [animator] = useState(
    () =>
      new PlainSingularAnimator(
        spriteTexture,
        props.frameCount,
        1,
        props.frameCount,
        props.frameCount * 0.27
      )
  );

  useFrame(() => {
    animator.animate();
  });

  return (
    <Suspense fallback={null}>
      <sprite position={[0.1, -0.7, 0]} scale={[3.3, 3.3, 3.3]}>
        <spriteMaterial attach="material" map={spriteTexture}></spriteMaterial>
      </sprite>
    </Suspense>
  );
};

export const LainIntro = () => {
  return <LainConstructor sprite={introSpriteSheet} frameCount={51} />;
};

export const LainStanding = () => {
  return <LainConstructor sprite={standingSpriteSheet} frameCount={1} />;
};

export const LainMoveDown = () => {
  return <LainConstructor sprite={moveDownSpriteSheet} frameCount={36} />;
};

export const LainMoveLeft = () => {
  return <LainConstructor sprite={moveLeftSpriteSheet} frameCount={47} />;
};

export const LainMoveRight = () => {
  return <LainConstructor sprite={moveRightSpriteSheet} frameCount={47} />;
};

export const LainMoveUp = () => {
  return <LainConstructor sprite={moveUpSpriteSheet} frameCount={36} />;
};

const Lain = (props: LainProps) => {
  return (
    <>
      {/* without a suspense the sprites wont load, and the suspense loading
    animation takes about .3 seconds to finish for each sprite resulting in
    blinks between each spritesheet. with a nested suspense we can have
    LainStanding as the suspense fallback with a fallback of its own (the
    loading message) which will only be shown once, when the game loads. */}
      <Suspense
        fallback={
          <Suspense fallback={<React.Fragment>loading...</React.Fragment>}>
            <LainStanding />
          </Suspense>
        }
      >
        {props.isLainMoving ? props.lainMoveState : <LainStanding />}
      </Suspense>
    </>
  );
};

export default Lain;
