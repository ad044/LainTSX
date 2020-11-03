import React, { useMemo } from "react";
import * as THREE from "three";

const GateMiddle = () => {
  const uniforms = useMemo(
    () => ({
      color1: {
        value: new THREE.Color("white"),
      },
      color2: {
        value: new THREE.Color("red"),
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
    uniform float alpha;

    varying vec2 vUv;
    
    void main() {
        float alpha = smoothstep(0.0, 1.0, vUv.y);
        float colorMix = smoothstep(1.0, 2.0, 1.8);

        gl_FragColor = vec4(mix(color1, color2, colorMix), alpha);
    }
      `;

  return (
    <>
      <mesh scale={[2,2,2]}>
        <planeBufferGeometry attach="geometry"></planeBufferGeometry>
        <shaderMaterial
          attach="material"
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
    </>
  );
};

export default GateMiddle;
