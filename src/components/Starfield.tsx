import { Interpolation, a } from "@react-spring/three";
import React, { createRef, memo, useMemo, useRef } from "react";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";

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
  ].map((poses) => useRef(poses.map(() => createRef())));

  useFrame(() => {
    blueFromRightRef.current.forEach((ref) => {
      if ((ref.current as any).position.x < -1) {
        (ref.current as any).position.x += 7.3;
        (ref.current as any).position.z -= 7.3;
      } else {
        (ref.current as any).position.x -= 0.03;
        (ref.current as any).position.z += 0.03;
      }
    });
    blueFromLeftRef.current.forEach((ref) => {
      if ((ref.current as any).position.x > 3) {
        (ref.current as any).position.x -= 8.3;
        (ref.current as any).position.z -= 8.3;
      } else {
        (ref.current as any).position.x += 0.03;
        (ref.current as any).position.z += 0.03;
      }
    });
    cyanFromRightRef.current.forEach((ref) => {
      if ((ref.current as any).position.x < -1) {
        (ref.current as any).position.x += 4.3;
        (ref.current as any).position.z -= 4.3;
      } else {
        (ref.current as any).position.x -= 0.03;
        (ref.current as any).position.z += 0.03;
      }
    });
    cyanFromLeftRef.current.forEach((ref) => {
      if ((ref.current as any).position.x > 3) {
        (ref.current as any).position.x -= 3.3;
        (ref.current as any).position.z -= 3.3;
      } else {
        (ref.current as any).position.x += 0.03;
        (ref.current as any).position.z += 0.03;
      }
    });
    whiteFromLeftRef.current.forEach((ref) => {
      if ((ref.current as any).position.x > 3) {
        (ref.current as any).position.x -= 3.3;
        (ref.current as any).position.z -= 3.3;
      } else {
        (ref.current as any).position.x += 0.02;
        (ref.current as any).position.z += 0.02;
      }
    });
  });

  return (
    <a.group
      position={[-0.7, 0, -4]}
      rotation={[0, 0, 0]}
      position-y={props.starfieldPosY}
    >
      {posesBlueFromRight.map((pos: any, idx: number) => {
        return (
          <mesh
            ref={(blueFromRightRef.current as any)[idx]}
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
      {posesBlueFromLeft.map((pos: any, idx: number) => {
        return (
          <mesh
            ref={(blueFromLeftRef.current as any)[idx]}
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
      {posesCyanFromRight.map((pos: any, idx: number) => {
        return (
          <mesh
            ref={(cyanFromRightRef.current as any)[idx]}
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
      {posesCyanFromLeft.map((pos: any, idx: number) => {
        return (
          <mesh
            ref={(cyanFromLeftRef.current as any)[idx]}
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
      {posesWhiteFromLeft.map((pos: any, idx: number) => {
        return (
          <mesh
            ref={(whiteFromLeftRef.current as any)[idx]}
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
