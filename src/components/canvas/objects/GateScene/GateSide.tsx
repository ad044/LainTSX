import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RepeatWrapping, DoubleSide } from "three";
import { useTexture } from "@react-three/drei";
import vertex from "@/shaders/gate_side.vert";
import leftFragment from "@/shaders/gate_side_left.frag";
import rightFragment from "@/shaders/gate_side_right.frag";

const GateSide = () => {
  const blueBinary = useTexture("/sprites/gate/blue_binary.png");

  // coming back to this a year or so later and i have no idea
  // what past me meant by this comment so im not gonna touch it :D
  // |
  // V
  // this is really fucking weird
  const texture = useMemo(() => {
    blueBinary.wrapS = RepeatWrapping;
    blueBinary.wrapT = RepeatWrapping;
    blueBinary.repeat.set(5, 5);
    return blueBinary;
  }, [blueBinary]);

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

  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      tex1: { type: "t", value: texture },
      offset: { value: 0 },
    }),
    [texture]
  );

  return (
    <>
      <mesh
        rotation={[0, 0.2, 0]}
        position={[-1.7, 0, 1.5]}
        scale={[3, 1.5, 0]}
        renderOrder={1}
      >
        <planeBufferGeometry attach="geometry" />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={leftFragment}
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
        <planeBufferGeometry attach="geometry" />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={rightFragment}
          transparent={true}
          ref={matRef}
          side={DoubleSide}
        />
      </mesh>
    </>
  );
};

export default GateSide;
