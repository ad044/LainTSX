import React, { useMemo, useRef } from "react";
import blueBinary from "../../static/sprite/blue_binary.png";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";

const GateSide = () => {
  const blueBinaryTex = useLoader(THREE.TextureLoader, blueBinary);

  // this is really fucking weird
  const texture = useMemo(() => {
    blueBinaryTex.wrapS = THREE.RepeatWrapping;
    blueBinaryTex.wrapT = THREE.RepeatWrapping;
    blueBinaryTex.repeat.set(5, 5);
    return blueBinaryTex;
  }, [blueBinaryTex]);

  const last = useRef(0);

  useFrame(() => {
    const now = Date.now();
    if (matRef.current) {
      if (now > last.current + 50) {
        matRef.current.uniforms.offset.value += 0.5;
        last.current = now;
      }
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
        float alpha = smoothstep(0.9, 1.0, vUv.x);

        vec4 t1 = texture2D(tex1,vUv * 5.0 + offset);
        
        gl_FragColor = mix(t1, vec4(0,0,0,0), alpha) * 0.8;
    }
      `;

  const fragmentShaderRight = `
    uniform sampler2D tex1;
    uniform float alpha;
    uniform float offset;

    varying vec2 vUv;
    
    void main() {
        float alpha = smoothstep(1.0, 0.9, vUv.x);

        vec4 t1 = texture2D(tex1,vUv * 5.0 + offset);
        
        gl_FragColor = mix(vec4(0,0,0,0), t1, alpha) * 0.8;
    }
      `;

  return (
    <>
      <mesh
        rotation={[0, 0.2, 0]}
        position={[-1.7, 0, 1.5]}
        scale={[3, 1.5, 0]}
        renderOrder={1}
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
        position={[1.7, 0, 1.5]}
        scale={[-3, 1.5, 0]}
        renderOrder={1}
      >
        <planeBufferGeometry attach="geometry"></planeBufferGeometry>
        <shaderMaterial
          attach="material"
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShaderRight}
          transparent={true}
          ref={matRef}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
};

export default GateSide;
