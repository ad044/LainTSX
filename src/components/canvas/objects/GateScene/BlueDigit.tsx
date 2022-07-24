import React, { useEffect, useMemo, useRef } from "react";
import { a, SpringValue } from "@react-spring/three";
import { useTexture } from "@react-three/drei";
import vertex from "@/shaders/blue_digit.vert";
import fragment from "@/shaders/blue_digit.frag";
import { Position } from "@/types";

type BlueDigitProps = {
  type: number;
  position: SpringValue<Position>;
};

const BlueDigit = (props: BlueDigitProps) => {
  const one = useTexture("/sprites/gate/blue_binary_singular_one.png");
  const zero = useTexture("/sprites/gate/blue_binary_singular_zero.png");

  const objRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      tex: {
        type: "t",
        value: props.type === 1 ? one : zero,
      },
      brightnessMultiplier: { value: 1.5 },
    }),
    [one, zero, props.type]
  );

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
      position={props.position}
      renderOrder={5}
      visible={false}
      ref={objRef}
    >
      <planeBufferGeometry attach="geometry" />
      <shaderMaterial
        fragmentShader={fragment}
        vertexShader={vertex}
        uniforms={uniforms}
        transparent={true}
        depthTest={false}
        ref={matRef}
      />
    </a.mesh>
  );
};

export default BlueDigit;
