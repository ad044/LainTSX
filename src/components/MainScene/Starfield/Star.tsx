import React, { useMemo, useRef } from "react";
import { a } from "@react-spring/three";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import lerp from "../../../utils/lerp";

type StarProps = {
  position: number[];
  color: string;
  shouldIntro: boolean;
};

const Star = (props: StarProps) => {
  const uniforms = useMemo(
    () => ({
      color1: {
        value: new THREE.Color("white"),
      },
      color2: {
        value: new THREE.Color(props.color),
      },
    }),
    [props.color]
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
    uniform float alpha;

    varying vec2 vUv;
    
    void main() {
        float alpha = smoothstep(0.0, 1.0, vUv.y);
        float colorMix = smoothstep(1.0, 2.0, 1.8);

        gl_FragColor = vec4(mix(color1, color2, colorMix), alpha) * 0.8;
    }
      `;

  const starRef = useRef<THREE.Object3D>();

  const amp = useRef(Math.random() / 10);

  const introAmpRef = useRef(props.shouldIntro ? 1 : 0);

  const deltaRef = useRef(0);
  useFrame((state, delta) => {
    deltaRef.current += delta;

    if (deltaRef.current > 0.016 && starRef.current) {
      if (starRef.current.position.y > 4) {
        starRef.current.position.y = props.position[1];
      }
      starRef.current.position.y += 0.01 + amp.current + introAmpRef.current;
      introAmpRef.current = lerp(introAmpRef.current, 0, 0.01);

      deltaRef.current = deltaRef.current % 0.016;
    }
  });

  return (
    <mesh
      position={props.position as [number, number, number]}
      scale={[0.01, 2, 0.01]}
      renderOrder={-1}
      ref={starRef}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <a.shaderMaterial
        attach="material"
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        transparent={true}
        depthWrite={false}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default Star;
