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
import { SpriteMaterial } from "three";
import { act } from "react-dom/test-utils";

type LevelSpriteConstructorProps = {
  sprite: string;
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number, (string | undefined)?];
};

type SpriteToPath = {
  [key: string]: [string, string];
};

const LevelSprite = (props: LevelSpriteConstructorProps) => {
  const [test, setTest] = useState(1.0);
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
    texture1: { type: "t", value: nonActiveTexture },
    texture2: { type: "t", value: activeTexture },
    alphaVal: { value: test },
  };

  const vertexShader = `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `;

  const fragmentShader = `
    uniform sampler2D texture1;
    uniform sampler2D texture2;
    uniform float alphaVal;

    varying vec2 vUv;

    void main() {
        vec4 tex1 = texture2D (texture1, vUv);
        vec4 tex2 = texture2D (texture2, vUv);
        vec3 mixCol  = mix(tex1.rgb / tex1.a, tex2.rgb / tex2.a, alphaVal);
        gl_FragColor = vec4(mixCol.rgb, 1.0);
        gl_FragColor.a = max(tex1.a, tex2.a); 
    }
  `;

  useFrame(() => {
    (materialRef.current! as any).uniforms.alphaVal = test;
  });

  return (
    <mesh
      position={props.position}
      scale={props.scale}
      rotation={props.rotation}
    >
      <planeBufferGeometry attach="geometry" />
      <shaderMaterial
        ref={materialRef}
        attach="material"
        uniforms={uniforms}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        side={THREE.DoubleSide}
        transparent={true}
        uniformsNeedUpdate={true}
      />
    </mesh>
  );
};

export default LevelSprite;
