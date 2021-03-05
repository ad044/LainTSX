import React, { useEffect, useMemo, useRef } from "react";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import gateBlueBinarySingularOne from "../../../static/sprites/gate/blue_binary_singular_one.png";
import { a, SpringValue } from "@react-spring/three";
import gateBlueBinarySingularZero from "../../../static/sprites/gate/blue_binary_singular_zero.png";

type BlueDigitProps = {
  type: number;
  posX: SpringValue<number>;
  posY: SpringValue<number>;
};

const BlueDigit = (props: BlueDigitProps) => {
  const gateBlueBinarySingularOneTex = useLoader(
    THREE.TextureLoader,
    gateBlueBinarySingularOne
  );
  const gateBlueBinarySingularZeroTex = useLoader(
    THREE.TextureLoader,
    gateBlueBinarySingularZero
  );

  const objRef = useRef<THREE.Mesh>();
  const matRef = useRef<THREE.ShaderMaterial>();

  const uniforms = useMemo(
    () => ({
      tex: {
        type: "t",
        value:
          props.type === 1
            ? gateBlueBinarySingularOneTex
            : gateBlueBinarySingularZeroTex,
      },
      brightnessMultiplier: { value: 1.5 },
    }),
    [gateBlueBinarySingularOneTex, gateBlueBinarySingularZeroTex, props.type]
  );

  const vertexShader = `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;

  const fragmentShader = `
    uniform sampler2D tex;
    uniform float brightnessMultiplier;
    varying vec2 vUv;
    
    void main() {
      gl_FragColor = texture2D(tex, vUv) * brightnessMultiplier;
    }
      `;

  useEffect(() => {
    setTimeout(() => {
      if (matRef.current) {
        matRef.current.uniforms.brightnessMultiplier.value = 3.5;
        matRef.current.uniformsNeedUpdate = true;
      }
    }, 1400);
    setTimeout(() => {
      if (objRef.current) objRef.current.visible = true;
    }, 150);
  }, []);

  return (
    <a.mesh
      scale={[props.type === 1 ? 0.04 : 0.08, 0.1, 0]}
      position-x={props.posX}
      position-y={props.posY}
      renderOrder={5}
      visible={false}
      ref={objRef}
    >
      <planeBufferGeometry attach="geometry" />
      <shaderMaterial
        fragmentShader={fragmentShader}
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

export default BlueDigit;
