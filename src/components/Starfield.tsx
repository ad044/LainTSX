import { a, Interpolation } from "@react-spring/three";
import React, { createRef, memo, RefObject, useMemo, useRef } from "react";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";

type StarRefsAndIncrementors = [
  React.MutableRefObject<React.RefObject<THREE.Object3D>[]>,
  number
][];

type StarfieldProps = {
  starfieldPosY: Interpolation<number, number>;
};

const Starfield = memo((props: StarfieldProps) => {
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

  const [
    posesBlueFromRight,
    posesBlueFromLeft,
    posesCyanFromRight,
    posesCyanFromLeft,
    posesWhiteFromLeft,
  ] = [40, 40, 10, 5, 5].map((x) =>
    Array.from({ length: x }, () => [
      lcgInstance() / 1000000000,
      lcgInstance() / 1000000000,
      lcgInstance() / 1000000000,
    ])
  );

  const [
    blueFromRightRef,
    blueFromLeftRef,
    cyanFromRightRef,
    cyanFromLeftRef,
    whiteFromLeftRef,
  ] = [
    posesBlueFromRight,
    posesBlueFromLeft,
    posesCyanFromRight,
    posesCyanFromLeft,
    posesWhiteFromLeft,
  ].map((poses) =>
    useRef<RefObject<THREE.Object3D>[]>(
      poses.map(() => createRef<THREE.Object3D>())
    )
  );

  // these arrays contain refs to the 3d planes and the increment values that they should move with across
  // the screen
  const fromRightStarRefsAndIncrementors: StarRefsAndIncrementors = [
    [blueFromRightRef, 7.3],
    [cyanFromRightRef, 4.3],
  ];

  const fromLeftStarRefsAndIncrementors: StarRefsAndIncrementors = [
    [blueFromLeftRef, 8.3],
    [cyanFromLeftRef, 3.3],
    [whiteFromLeftRef, 3.3],
  ];

  useFrame(() => {
    // planes (stars) coming from right move to positive X and negative Z direction
    fromRightStarRefsAndIncrementors.forEach((el) => {
      el[0].current.forEach((posRef: RefObject<THREE.Object3D>) => {
        if (posRef.current!.position.x < -1) {
          posRef.current!.position.x += el[1];
          posRef.current!.position.z -= el[1];
        } else {
          posRef.current!.position.x -= 0.03;
          posRef.current!.position.z += 0.03;
        }
      });
    });

    // the ones that are coming from left move to negative X and Z
    fromLeftStarRefsAndIncrementors.forEach((el) => {
      el[0].current.forEach((posRef: RefObject<THREE.Object3D>) => {
        if (posRef.current!.position.x > 3) {
          posRef.current!.position.x -= el[1];
          posRef.current!.position.z -= el[1];
        } else {
          posRef.current!.position.x += 0.03;
          posRef.current!.position.z += 0.03;
        }
      });
    });
  });

  return (
    <a.group
      position={[-0.7, 0, -4]}
      rotation={[0, 0, 0]}
      position-y={props.starfieldPosY}
    >
      {posesBlueFromRight.map((pos: number[], idx: number) => {
        return (
          <mesh
            ref={blueFromRightRef.current[idx]}
            scale={[0.01, 2, 1]}
            rotation={[1.7, 0, 0.9]}
            position={[pos[0], pos[1], pos[2]]}
            key={pos[0]}
            renderOrder={-1}
          >
            <planeGeometry attach="geometry" />
            <shaderMaterial
              attach="material"
              uniforms={blueUniforms}
              fragmentShader={fragmentShader}
              vertexShader={vertexShader}
              side={THREE.DoubleSide}
              transparent={true}
              depthWrite={false}
            />
          </mesh>
        );
      })}
      {posesBlueFromLeft.map((pos: number[], idx: number) => {
        return (
          <mesh
            ref={blueFromLeftRef.current[idx]}
            scale={[0.01, 2, 1]}
            rotation={[1.7, 0, -0.9]}
            position={[pos[0] - 2.4, pos[1] - 0.5, pos[2]]}
            key={pos[0]}
            renderOrder={-1}
          >
            <planeGeometry attach="geometry" />
            <shaderMaterial
              attach="material"
              uniforms={blueUniforms}
              fragmentShader={fragmentShader}
              vertexShader={vertexShader}
              side={THREE.DoubleSide}
              transparent={true}
              depthWrite={false}
            />
          </mesh>
        );
      })}
      {posesCyanFromRight.map((pos: number[], idx: number) => {
        return (
          <mesh
            ref={cyanFromRightRef.current[idx]}
            scale={[0.01, 0.9, 1]}
            position={[pos[0] - 1.3, pos[1], pos[2] + 1.5]}
            rotation={[1.7, 0, 0.9]}
            renderOrder={-1}
            key={pos[0]}
          >
            <planeGeometry attach="geometry" />
            <shaderMaterial
              attach="material"
              uniforms={cyanUniforms}
              fragmentShader={fragmentShader}
              vertexShader={vertexShader}
              side={THREE.DoubleSide}
              transparent={true}
              depthWrite={false}
            />
          </mesh>
        );
      })}
      {posesCyanFromLeft.map((pos: number[], idx: number) => {
        return (
          <mesh
            ref={cyanFromLeftRef.current[idx]}
            scale={[0.01, 0.9, 1]}
            position={[pos[0] - 1.3, pos[1], pos[2] + 1.5]}
            rotation={[1.7, 0, -0.9]}
            renderOrder={-1}
            key={pos[0]}
          >
            <planeGeometry attach="geometry" />
            <shaderMaterial
              attach="material"
              uniforms={cyanUniforms}
              fragmentShader={fragmentShader}
              vertexShader={vertexShader}
              side={THREE.DoubleSide}
              transparent={true}
              depthWrite={false}
            />
          </mesh>
        );
      })}
      {posesWhiteFromLeft.map((pos: number[], idx: number) => {
        return (
          <mesh
            ref={whiteFromLeftRef.current[idx]}
            scale={[0.01, 0.9, 1]}
            position={[pos[0] - 1.3, pos[1] + 0.5, pos[2] + 1.5]}
            rotation={[1.7, 0, -0.9]}
            renderOrder={-1}
            key={pos[0]}
          >
            <planeGeometry attach="geometry" />
            <shaderMaterial
              attach="material"
              uniforms={whiteUniforms}
              fragmentShader={fragmentShader}
              vertexShader={vertexShader}
              side={THREE.DoubleSide}
              transparent={true}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </a.group>
  );
});

export default Starfield;
