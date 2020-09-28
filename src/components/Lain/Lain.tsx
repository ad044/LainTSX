import { a, useSpring } from "@react-spring/three";
import React, { Suspense, useState } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { PlainSingularAnimator } from "three-plain-animator/lib/plain-singular-animator";
import moveDownSpriteSheet from "../../static/sprites/jump_down.png";
import moveUpSpriteSheet from "../../static/sprites/jump_up.png";
import moveLeftSpriteSheet from "../../static/sprites/move_left.png";
import moveRightSpriteSheet from "../../static/sprites/move_right.png";
import standingSpriteSheet from "../../static/sprites/standing.png";
import introSpriteSheet from "../../static/sprites/intro.png";
import { useRecoilValue } from "recoil";
import { lainMoveStateAtom, lainMovingAtom, lainPosYAtom } from "./LainAtom";

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

export const LainIntro = () => {
    return (
        <LainConstructor
            sprite={introSpriteSheet}
            frameCount={50}
            framesHorizontal={10}
            framesVertical={5}
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

const Lain = () => {
    const lainMoving = useRecoilValue(lainMovingAtom);
    const lainMoveState = useRecoilValue(lainMoveStateAtom);
    const lainPosY = useRecoilValue(lainPosYAtom);

    const lainPosYState = useSpring({
        lainPosY: lainPosY,
        config: { duration: 1200 },
    });

    return (
        <Suspense fallback={<>loading...</>}>
            <a.sprite
                position-y={lainPosYState.lainPosY}
                scale={[4.8, 4.8, 4.8]}
            >
                {lainMoving ? lainMoveState : <LainStanding />}
            </a.sprite>
        </Suspense>
    );
};

export default Lain;
