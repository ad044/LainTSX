import React, { useEffect, useMemo, useRef } from "react";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import gateBlueBinarySingularZero from "../../../static/sprite/blue_binary_singular_zero.png";
import { a, SpringValue } from "@react-spring/three";
import sleep from "../../../utils/sleep";

type BlueZeroProps = {
  posX: SpringValue<number>;
  posY: SpringValue<number>;
  visibility: SpringValue<boolean>;
};

const BlueZero = (props: BlueZeroProps) => {
  const gateBlueBinarySingularZeroTex = useLoader(
    THREE.TextureLoader,
    gateBlueBinarySingularZero
  );

  const matRef = useRef<THREE.ShaderMaterial>();

  const uniforms = useMemo(
    () => ({
      zeroTex: { type: "t", value: gateBlueBinarySingularZeroTex },
      brightnessMultiplier: { value: 1.5 },
    }),
    [gateBlueBinarySingularZeroTex]
  );

  const vertexShader = `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;

  const fragmentShaderZero = `
    uniform sampler2D zeroTex;
    uniform float brightnessMultiplier;
    
    varying vec2 vUv;
    
    void main() {
      gl_FragColor = texture2D(zeroTex, vUv) * brightnessMultiplier;
    }
      `;

  useEffect(() => {
    (async () => {
      await sleep(1400);
      if (matRef.current) {
        matRef.current.uniforms.brightnessMultiplier.value = 3.5;
      }
    })();
  }, []);

  return (
    <a.mesh
      scale={[0.08, 0.1, 0]}
      position-x={props.posX}
      position-y={props.posY}
      renderOrder={5}
      visible={props.visibility}
    >
      <planeBufferGeometry attach="geometry"></planeBufferGeometry>
      <shaderMaterial
        fragmentShader={fragmentShaderZero}
        vertexShader={vertexShader}
        uniforms={uniforms}
        attach="material"
        transparent={true}
        depthTest={false}
        ref={matRef}
      />
    </a.mesh>
  );
};

export default BlueZero;
