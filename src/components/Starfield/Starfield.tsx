import { a, useSpring } from "@react-spring/three";
import React, {
  createRef,
  memo,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";
import {
  introStarfieldVisibilityAtom,
  mainStarfieldBoostValAtom,
  mainStarfieldVisibilityAtom,
  starfieldPosYAtom,
} from "./StarfieldAtom";
import { useRecoilValue } from "recoil";

type StarRefsAndInitialPoses = [
  React.MutableRefObject<React.RefObject<THREE.Object3D>[]>,
  number[][]
][];

type StarfieldObjectData = {
  starPoses: number[][];
  ref: React.MutableRefObject<React.RefObject<THREE.Object3D>[]>;
  rotation: number[];
  positionSpecifier: number[];
  uniform?:
    | { color1: { value: THREE.Color }; color2: { value: THREE.Color } }
    | undefined;
};

type IntroStarfieldObjectData = {
  starPoses: number[][];
  ref: React.MutableRefObject<React.RefObject<THREE.Object3D>[]>;
  uniform?:
    | { color1: { value: THREE.Color }; color2: { value: THREE.Color } }
    | undefined;
};

const Starfield = memo(() => {
  const introStarfieldGroupRef = useRef<THREE.Object3D>();

  const starfieldPosY = useRecoilValue(starfieldPosYAtom);

  const introStarfieldVisible = useRecoilValue(introStarfieldVisibilityAtom);
  const mainStarfieldVisible = useRecoilValue(mainStarfieldVisibilityAtom);

  const mainStarfieldBoostVal = useRecoilValue(mainStarfieldBoostValAtom);

  const starfieldState = useSpring({
    starfieldPosY: starfieldPosY,
    starfieldBoostVal: mainStarfieldBoostVal,
    config: { duration: 1200 },
  });

  const vertexShader = `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;

  const fragmentShader = `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float alpha;

    varying vec2 vUv;
    
    void main() {
        float alpha = smoothstep(0.0, 1.0, vUv.y);
        float colorMix = smoothstep(1.0, 2.0, 1.8);

        gl_FragColor = vec4(mix(color1, color2, colorMix), alpha);
    }
      `;

  const LCG = (a: number, c: number, m: number, s: number) => () =>
    (s = (s * a + c) % m);

  const lcgInstance = LCG(1664525, 1013904223, 2 ** 32, 2);

  const uniformConstructor = (col: string) => {
    return {
      color1: {
        value: new THREE.Color("white"),
      },
      color2: {
        value: new THREE.Color(col),
      },
    };
  };

  const [blueUniforms, cyanUniforms, whiteUniforms] = [
    "blue",
    "cyan",
    "gray",
  ].map((color: string) => useMemo(() => uniformConstructor(color), [color]));

  const [
    posesBlueFromRight,
    posesBlueFromLeft,
    posesCyanFromRight,
    posesCyanFromLeft,
    posesWhiteFromRight,
    posesWhiteFromLeft,
  ] = [5, 5, 5, 5, 5, 5].map((x) =>
    Array.from({ length: x }, () => [
      lcgInstance() / 1000000000,
      lcgInstance() / 1000000000 - 1,
      lcgInstance() / 1000000000,
    ])
  );

  const [
    blueFromRightRef,
    blueFromLeftRef,
    cyanFromRightRef,
    cyanFromLeftRef,
    whiteFromRightRef,
    whiteFromLeftRef,
  ] = [
    posesBlueFromRight,
    posesBlueFromLeft,
    posesCyanFromRight,
    posesCyanFromLeft,
    posesWhiteFromRight,
    posesWhiteFromLeft,
  ].map((poses) =>
    useRef<RefObject<THREE.Object3D>[]>(
      poses.map(() => createRef<THREE.Object3D>())
    )
  );

  const [introPosesBlue, introPosesCyan, introPosesWhite] = [
    80,
    80,
    60,
  ].map((x) =>
    Array.from({ length: x }, () => [
      lcgInstance() / 1000000050,
      lcgInstance() / 100000099,
      lcgInstance() / 1000000050,
    ])
  );

  const [introBlueRef, introCyanRef, introWhiteRef] = [
    introPosesBlue,
    introPosesCyan,
    introPosesWhite,
  ].map((poses) =>
    useRef<RefObject<THREE.Object3D>[]>(
      poses.map(() => createRef<THREE.Object3D>())
    )
  );

  const fromRightStarRefsAndInitialPoses: StarRefsAndInitialPoses = [
    [blueFromRightRef, posesBlueFromRight],
    [cyanFromRightRef, posesCyanFromRight],
    [whiteFromRightRef, posesWhiteFromRight],
  ];

  const fromLeftStarRefsAndInitialPoses: StarRefsAndInitialPoses = [
    [blueFromLeftRef, posesBlueFromLeft],
    [cyanFromLeftRef, posesCyanFromLeft],
    [whiteFromLeftRef, posesWhiteFromLeft],
  ];

  const starSpeeds = Array.from(
    { length: 60 },
    () => lcgInstance() / 100000000000
  );

  useFrame(() => {
    if (introStarfieldVisible) {
      introStarfieldGroupRef.current!.position.y += 0.2;
    }
    if (mainStarfieldVisible) {
      // planes (stars) coming from right move to positive X and negative Z direction
      fromRightStarRefsAndInitialPoses.forEach((el) => {
        el[0].current.forEach(
          (posRef: RefObject<THREE.Object3D>, idx: number) => {
            if (posRef.current!.position.x < -1) {
              posRef.current!.position.x = el[1][idx][0] + 6;
              posRef.current!.position.z = el[1][idx][2] - 2.5;
            }
            posRef.current!.position.x -=
              0.03 + starSpeeds[idx] + starfieldState.starfieldBoostVal.get();
            posRef.current!.position.z +=
              0.035 + starfieldState.starfieldBoostVal.get() * 0.5;
          }
        );
      });
      // the ones that are coming from left move to negative X and Z
      fromLeftStarRefsAndInitialPoses.forEach((el) => {
        el[0].current.forEach(
          (posRef: RefObject<THREE.Object3D>, idx: number) => {
            if (posRef.current!.position.x > 3) {
              posRef.current!.position.x = el[1][idx][0] - 9;
              posRef.current!.position.z = el[1][idx][2] - 0.5;
            } else {
              posRef.current!.position.x +=
                0.03 + starSpeeds[idx] + starfieldState.starfieldBoostVal.get();
              posRef.current!.position.z +=
                0.015 + starfieldState.starfieldBoostVal.get() * 0.5;
            }
          }
        );
      });
    }
  });

  const mainStarfieldObjects = [
    {
      starPoses: posesBlueFromRight,
      ref: blueFromRightRef,
      rotation: [1.7, 0, 1],
      positionSpecifier: [6, 0, -2.5],
      uniform: blueUniforms,
    },
    {
      starPoses: posesBlueFromLeft,
      ref: blueFromLeftRef,
      rotation: [1.7, 0, -1.2],
      positionSpecifier: [-2.4, -0.5, 2],
      uniform: blueUniforms,
    },
    {
      starPoses: posesCyanFromRight,
      ref: cyanFromRightRef,
      rotation: [1.7, 0, 1],
      positionSpecifier: [6, 0, -2.5],
      uniform: cyanUniforms,
    },
    {
      starPoses: posesCyanFromLeft,
      ref: cyanFromLeftRef,
      rotation: [1.7, 0, -1.2],
      positionSpecifier: [-1.3, 0, 2.5],
      uniform: cyanUniforms,
    },
    {
      starPoses: posesWhiteFromLeft,
      ref: whiteFromLeftRef,
      rotation: [1.7, 0, -1.2],
      positionSpecifier: [-1.3, 0.5, 2.3],
      uniform: whiteUniforms,
    },
    {
      starPoses: posesWhiteFromRight,
      ref: whiteFromRightRef,
      rotation: [1.7, 0, 1],
      positionSpecifier: [-1.3, 0.5, -2.5],
      uniform: whiteUniforms,
    },
  ];

  const introStarfieldObjects = [
    {
      starPoses: introPosesBlue,
      ref: introBlueRef,
      uniform: blueUniforms,
    },
    {
      starPoses: introPosesCyan,
      ref: introCyanRef,
      uniform: cyanUniforms,
    },
    {
      starPoses: introPosesWhite,
      ref: introWhiteRef,
      uniform: whiteUniforms,
    },
  ];

  return (
    <>
      <a.group
        ref={introStarfieldGroupRef}
        position={[-2, -35, -3.2]}
        rotation={[0, 0, 0]}
        visible={introStarfieldVisible}
      >
        {introStarfieldObjects.map((obj: IntroStarfieldObjectData) =>
          obj.starPoses.map((pos: number[], idx: number) => {
            return (
              <mesh
                ref={obj.ref.current[idx]}
                scale={[0.005, 2, 0.005]}
                position={[pos[0], pos[1], pos[2]]}
                key={pos[0]}
                renderOrder={-1}
              >
                <boxBufferGeometry attach="geometry" />
                <shaderMaterial
                  attach="material"
                  uniforms={obj.uniform}
                  fragmentShader={fragmentShader}
                  vertexShader={vertexShader}
                  side={THREE.DoubleSide}
                  transparent={true}
                  depthWrite={false}
                />
              </mesh>
            );
          })
        )}
      </a.group>
      <a.group
        position={[-0.7, 0, -5]}
        rotation={[0, 0, 0]}
        position-y={starfieldState.starfieldPosY}
        visible={mainStarfieldVisible}
      >
        {mainStarfieldObjects.map((obj: StarfieldObjectData) =>
          obj.starPoses.map((pos: number[], idx: number) => {
            return (
              <mesh
                ref={obj.ref.current[idx]}
                position={[
                  pos[0] + obj.positionSpecifier[0],
                  pos[1] + obj.positionSpecifier[1],
                  pos[2] + obj.positionSpecifier[2],
                ]}
                rotation={obj.rotation as [number, number, number]}
                scale={[0.01, 2, 0.01]}
                renderOrder={-1}
                key={pos[0]}
              >
                <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
                <a.shaderMaterial
                  attach="material"
                  uniforms={obj.uniform}
                  fragmentShader={fragmentShader}
                  vertexShader={vertexShader}
                  transparent={true}
                  depthWrite={false}
                />
              </mesh>
            );
          })
        )}
      </a.group>
    </>
  );
});

export default Starfield;
