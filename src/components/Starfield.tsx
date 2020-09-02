import React, { useMemo, useReducer, useRef, createRef } from "react";
import * as THREE from "three";
import { a, useSpring } from "@react-spring/three";
import { useFrame } from "react-three-fiber";

const Starfield = () => {
  const blueUniforms = useMemo(
    () => ({
      color1: {
        value: new THREE.Color("white"),
      },
      color2: {
        value: new THREE.Color("blue"),
      },
    }),
    []
  );

  const cyanUniforms = useMemo(
    () => ({
      color1: {
        value: new THREE.Color("white"),
      },
      color2: {
        value: new THREE.Color("cyan"),
      },
    }),
    []
  );

  const whiteUniforms = useMemo(
    () => ({
      color1: {
        value: new THREE.Color("white"),
      },
      color2: {
        value: new THREE.Color("gray"),
      },
    }),
    []
  );

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

  const posesBlueFromRight = Array.from({ length: 40 }, () => [
    lcgInstance() / 1000000000,
    lcgInstance() / 1000000000,
    lcgInstance() / 1000000000,
  ]);

  const posesBlueFromLeft = Array.from({ length: 25 }, () => [
    lcgInstance() / 1000000000,
    lcgInstance() / 1000000000,
    lcgInstance() / 1000000000,
  ]);

  const posesCyanFromRight = Array.from({ length: 10 }, () => [
    lcgInstance() / 1000000000,
    lcgInstance() / 1000000000,
    lcgInstance() / 1000000000,
  ]);

  const posesCyanFromLeft = Array.from({ length: 5 }, () => [
    lcgInstance() / 1000000000,
    lcgInstance() / 1000000000,
    lcgInstance() / 1000000000,
  ]);

  const posesWhiteFromleft = Array.from({ length: 5 }, () => [
    lcgInstance() / 1000000000,
    lcgInstance() / 1000000000,
    lcgInstance() / 1000000000,
  ]);

  const blueFromRightRef = useRef(posesBlueFromRight.map(() => createRef()));
  const blueFromLeftRef = useRef(posesBlueFromLeft.map(() => createRef()));
  const cyanFromRightRef = useRef(posesCyanFromRight.map(() => createRef()));
  const cyanFromLeftRef = useRef(posesCyanFromLeft.map(() => createRef()));
  const whiteFromLeftRef = useRef(posesWhiteFromleft.map(() => createRef()));

  useFrame(() => {
    blueFromRightRef.current.map((ref) => {
      if ((ref.current as any).position.x < -1) {
        (ref.current as any).position.x += 7.3;
        (ref.current as any).position.z -= 7.3;
      } else {
        (ref.current as any).position.x -= 0.03;
        (ref.current as any).position.z += 0.03;
      }
    });
    blueFromLeftRef.current.map((ref) => {
      if ((ref.current as any).position.x > 3) {
        (ref.current as any).position.x -= 3.3;
        (ref.current as any).position.z -= 3.3;
      } else {
        (ref.current as any).position.x += 0.03;
        (ref.current as any).position.z += 0.03;
      }
    });
    cyanFromRightRef.current.map((ref) => {
      if ((ref.current as any).position.x < -1) {
        (ref.current as any).position.x += 4.3;
        (ref.current as any).position.z -= 4.3;
      } else {
        (ref.current as any).position.x -= 0.03;
        (ref.current as any).position.z += 0.03;
      }
    });
    cyanFromLeftRef.current.map((ref) => {
      if ((ref.current as any).position.x > 3) {
        (ref.current as any).position.x -= 3.3;
        (ref.current as any).position.z -= 3.3;
      } else {
        (ref.current as any).position.x += 0.03;
        (ref.current as any).position.z += 0.03;
      }
    });
    whiteFromLeftRef.current.map((ref) => {
      if ((ref.current as any).position.x > 3) {
        (ref.current as any).position.x -= 3.3;
        (ref.current as any).position.z -= 3.3;
      } else {
        (ref.current as any).position.x += 0.03;
        (ref.current as any).position.z += 0.03;
      }
    });
  });

  return (
    <group position={[-0.7, -1.5, -4]}>
      {posesBlueFromRight.map((pos: any, idx: number) => {
        return (
          <mesh
            ref={(blueFromRightRef.current as any)[idx]}
            scale={[0.01, 2, 1]}
            rotation={[1.7, 0, 0.9]}
            position={[pos[0], pos[1], pos[2]]}
            key={idx}
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
            position={[pos[0] - 2.4, pos[1] - 1.5, pos[2]]}
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
      {posesWhiteFromleft.map((pos: any, idx: number) => {
        return (
          <mesh
            ref={(whiteFromLeftRef.current as any)[idx]}
            scale={[0.01, 0.9, 1]}
            position={[pos[0] - 1.3, pos[1], pos[2] + 1.5]}
            rotation={[1.7, 0, -0.9]}
            renderOrder={-1}
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
    </group>
  );
};

export default Starfield;
