import React, { useMemo } from "react";
import * as THREE from "three";

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

  return (
    <group>
      <mesh scale={[0.01, 0.9, 1]}>
        <planeGeometry attach="geometry" />
        <shaderMaterial
          attach="material"
          uniforms={blueUniforms}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          side={THREE.DoubleSide}
          transparent={true}
        />
      </mesh>
      <mesh scale={[0.01, 0.9, 1]} position={[0.1, 0, 0]}>
        <planeGeometry attach="geometry" />
        <shaderMaterial
          attach="material"
          uniforms={cyanUniforms}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          side={THREE.DoubleSide}
          transparent={true}
        />
      </mesh>
      <mesh scale={[0.01, 0.9, 1]} position={[0.2, 0, 0]}>
        <planeGeometry attach="geometry" />
        <shaderMaterial
          attach="material"
          uniforms={whiteUniforms}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          side={THREE.DoubleSide}
          transparent={true}
        />
      </mesh>
    </group>
  );
};

export default Starfield;
