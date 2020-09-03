import React, { useRef, useMemo, memo } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import Cou from "../static/sprites/Cou.png";
import CouActive from "../static/sprites/Cou_active.png";
import Dc from "../static/sprites/Dc.png";
import DcActive from "../static/sprites/Dc_active.png";
import SSkn from "../static/sprites/SSkn.png";
import SSKnActive from "../static/sprites/SSkn_active.png";
import Tda from "../static/sprites/Tda.png";
import TdaActive from "../static/sprites/Tda_active.png";

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

const LevelSprite = memo((props: LevelSpriteConstructorProps) => {
  // the game only has a couple of sprites that it displays in the hub
  // dynamically importnig them would be worse for performance,
  // so we import all of them here and then use this function to
  // associate a sprite with the path
  const spriteToPath = (sprite: string) => {
    return ({
      Dc: [Dc, DcActive],
      Tda: [Tda, TdaActive],
      SSkn: [SSkn, SSKnActive],
      Cou: [Cou, CouActive],
    } as SpriteToPath)[sprite];
  };

  const materialRef = useRef();

  const spriteSheet = spriteToPath(props.sprite);

  const nonActiveTexture: any = useLoader(THREE.TextureLoader, spriteSheet[0]);
  const activeTexture: any = useLoader(THREE.TextureLoader, spriteSheet[1]);

  const uniforms = useMemo(
    () => ({
      tex1: { type: "t", value: nonActiveTexture },
      tex2: { type: "t", value: activeTexture },
      timeMSeconds: { value: (Date.now() % (Math.PI * 2000)) / 1000.0 },
    }),
    [nonActiveTexture, activeTexture]
  );

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
        float bias = abs(sin(timeMSeconds / (1.6 / M_PI)));
        gl_FragColor = mix(t1, t2, bias);
    }
  `;

  useFrame(() => {
    if (materialRef.current) {
      (materialRef.current! as any).uniforms.timeMSeconds.value =
        (Date.now() % (Math.PI * 2000)) / 1000.0;
    }
  });

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
});

export default LevelSprite;
