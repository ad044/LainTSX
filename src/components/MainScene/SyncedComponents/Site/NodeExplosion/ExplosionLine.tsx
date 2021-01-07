import React, { useMemo } from "react";
import * as THREE from "three";
import { a } from "@react-spring/three";

type LineProps = {
  rotation: number[];
  position: number[];
  color: string;
  length: number;
};

const ExplosionLine = (props: LineProps) => {
  const uniforms = useMemo(
    () => ({
      color1: {
        value: new THREE.Color("white"),
      },
      color2: {
        value: new THREE.Color(
          props.color === "yellow" ? "#f5cc16" : "#e33d00"
        ),
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
        float alpha = smoothstep(1.0, 0.0, vUv.y);
        float colorMix = smoothstep(1.0, 2.0, 1.8);

        gl_FragColor = vec4(mix(color1, color2, colorMix), alpha) * 0.7;
    }
      `;

  return (
    <mesh
      rotation={props.rotation as [number, number, number]}
      position={props.position as [number, number, number]}
      scale={[0.01, props.length, 0]}
      renderOrder={-1}
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

export default ExplosionLine;
