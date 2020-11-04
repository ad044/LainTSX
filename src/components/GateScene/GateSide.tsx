import React, { useMemo, useRef } from "react";
import blueBinary from "../../static/sprite/blue_binary.png";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { OrbitControls } from "drei";

const GateSide = () => {
  const blueBinaryTex = useLoader(THREE.TextureLoader, blueBinary);

  // this is really fucking weird
  const texture = useMemo(() => {
    blueBinaryTex.wrapS = THREE.RepeatWrapping;
    blueBinaryTex.wrapT = THREE.RepeatWrapping;
    blueBinaryTex.repeat.set(5, 5);
    return blueBinaryTex;
  }, [blueBinaryTex]);

  useFrame(() => {
    if (Date.now() % 2 === 0 && matRef.current) {
      matRef.current.uniforms.offset.value += 0.5;
    }
  });

  const matRef = useRef<THREE.ShaderMaterial>();

  const uniforms = useMemo(
    () => ({
      tex1: { type: "t", value: texture },
      offset: { value: 0 },
    }),
    [texture]
  );

  const vertexShader = `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;

  const fragmentShaderLeft = `
    uniform sampler2D tex1;
    uniform float alpha;
    uniform float offset;

    varying vec2 vUv;
    
    void main() {
        float alpha = smoothstep(0.7, 1.0, vUv.x);

        vec4 t1 = texture2D(tex1,vUv * 5.0 + offset);
        
        gl_FragColor = mix(t1, vec4(0,0,0,0), alpha);
    }
      `;

  const fragmentShaderRight = `
    uniform sampler2D tex1;
    uniform float alpha;
    uniform float offset;

    varying vec2 vUv;
    
    void main() {
        float alpha = smoothstep(0.3, 1.0, vUv.x);

        vec4 t1 = texture2D(tex1,vUv * 5.0 + offset);
        
        gl_FragColor = mix(vec4(0,0,0,0), t1, alpha) * 1.4;
    }
      `;

  return (
    <>
      <OrbitControls />
      <mesh
        rotation={[0, 0.2, 0]}
        position={[-1.4, 0, 1.5]}
        scale={[3, 1.5, 0]}
      >
        <planeBufferGeometry attach="geometry"></planeBufferGeometry>
        <shaderMaterial
          attach="material"
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShaderLeft}
          transparent={true}
          ref={matRef}
        />
      </mesh>
      <mesh
        rotation={[0, -0.2, 0]}
        position={[0.05, 0, 1.3]}
        scale={[3, 1.5, 0]}
      >
        <planeBufferGeometry attach="geometry"></planeBufferGeometry>
        <shaderMaterial
          attach="material"
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShaderRight}
          transparent={true}
          ref={matRef}
        />
      </mesh>
    </>
  );
};

export default GateSide;
