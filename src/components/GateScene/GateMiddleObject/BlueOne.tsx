import React, { useEffect, useMemo, useRef } from "react";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import gateBlueBinarySingularOne from "../../../static/sprite/blue_binary_singular_one.png";
import { a, SpringValue } from "@react-spring/three";

type BlueOneProps = {
  posX: SpringValue<number>;
  posY: SpringValue<number>;
  visibility: SpringValue<boolean>;
};

const BlueOne = (props: BlueOneProps) => {
  const gateBlueBinarySingularOneTex = useLoader(
    THREE.TextureLoader,
    gateBlueBinarySingularOne
  );

  const matRef = useRef<THREE.ShaderMaterial>();

  const uniforms = useMemo(
    () => ({
      oneTex: { type: "t", value: gateBlueBinarySingularOneTex },
      brightnessMultiplier: { value: 1.5 },
    }),
    [gateBlueBinarySingularOneTex]
  );

  const vertexShader = `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;

  const fragmentShaderOne = `
    uniform sampler2D oneTex;
    uniform float brightnessMultiplier;
    varying vec2 vUv;
    
    void main() {
      gl_FragColor = texture2D(oneTex, vUv) * brightnessMultiplier;
    }
      `;

  useEffect(() => {
    setTimeout(() => {
      if (matRef.current)
        matRef.current.uniforms.brightnessMultiplier.value = 3.5;
    }, 1400);
  }, []);

  return (
    <a.mesh
      scale={[0.04, 0.1, 0]}
      position-x={props.posX}
      position-y={props.posY}
      renderOrder={5}
      visible={props.visibility}
    >
      <planeBufferGeometry attach="geometry"></planeBufferGeometry>
      <shaderMaterial
        fragmentShader={fragmentShaderOne}
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

export default BlueOne;
