import React, { Suspense, useMemo, useState, useEffect, useRef } from "react";
import { useFrame, useLoader, useThree } from "react-three-fiber";
import * as THREE from "three";
import movie from "../static/sprites/movie.png";
import movieActive from "../static/sprites/movie_active.png";
import touko from "../static/sprites/touko.png";
import toukoActive from "../static/sprites/touko_active.png";
import s from "../static/sprites/s.png";
import sActive from "../static/sprites/s_active.png";
import copland from "../static/sprites/copland.png";
import coplandActive from "../static/sprites/copland_active.png";

type LevelSpriteConstructorProps = {
  sprite: string;
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number, (string | undefined)?];
  active: boolean;
};

type SpriteToPath = {
  [key: string]: [string, string];
};

const LevelSprite = (props: LevelSpriteConstructorProps) => {
  // the game only has a couple of sprites that it displays in the hub
  // dynamically importnig them would be worse for performance,
  // so we import all of them here and then use this function to
  // associate a sprite with the path
  // (yes, imbad at naming them)
  const spriteToPath = (sprite: string) => {
    return ({
      movie: [movie, movieActive],
      touko: [touko, toukoActive],
      s: [s, sActive],
      copland: [copland, coplandActive],
    } as SpriteToPath)[sprite];
  };

  const materialRef = useRef();

  const spriteSheet = spriteToPath(props.sprite);

  const nonActiveTexture: any = useLoader(THREE.TextureLoader, spriteSheet[0]);
  const activeTexture: any = useLoader(THREE.TextureLoader, spriteSheet[1]);

  const uniforms = {
    tex1: { type: "t", value: nonActiveTexture },
    tex2: { type: "t", value: activeTexture },
    timeMSeconds: { value: Date.now() },
  };

  const vertexShader = `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float;

    uniform sampler2D tex1;
    uniform sampler2D tex2;
    uniform float timeMSeconds;

    varying vec2 vUv;

    #define M_PI 3.1415926535897932384626433832795

    void main() {
        vec4 t1 = texture2D(tex1,vUv);
        vec4 t2 = texture2D(tex2,vUv);
        float bias = abs(sin(timeMSeconds / (1600.0 / M_PI)));
        gl_FragColor = mix(t1, t2, bias);
    }
  `;

  const timeRef = Date.now();

  useFrame(() => {
    if (materialRef.current) {
      (materialRef.current! as any).uniforms.timeMSeconds.value = Date.now() - timeRef;
    }
  });

  // useEffect(() => {
  //   setInterval(() => {
  //     if (materialRef.current) {
  //       const currentRef = materialRef.current! as any;
  //       if (currentRef.uniforms.alpha.value > 0.1) {
  //         currentRef.uniforms.alpha.value = (
  //           currentRef.uniforms.alpha.value - 0.1
  //         ).toPrecision(1);
  //       } else {
  //         currentRef.uniforms.alpha.value = 1.0;
  //       }
  //     }
  //   }, 125);
  // }, []);

  return (
    <mesh
      position={props.position}
      scale={props.scale}
      rotation={props.rotation}
    >
      <planeBufferGeometry attach="geometry" />
      {props.active ? (
        <shaderMaterial
          ref={materialRef}
          attach="material"
          uniforms={uniforms}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          side={THREE.DoubleSide}
          transparent={true}
        />
      ) : (
        <meshStandardMaterial
          attach="material"
          map={nonActiveTexture}
          side={THREE.DoubleSide}
          transparent={true}
        />
      )}
    </mesh>
  );
};

export default LevelSprite;
