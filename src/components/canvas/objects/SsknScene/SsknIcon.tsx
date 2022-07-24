import React, { memo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide } from "three";
import { useTexture } from "@react-three/drei";

const SsknIcon = () => {
  const icon = useTexture("/sprites/sskn/SSkn_icon.png");
  const ssknIconRef = useRef<THREE.Mesh>(null);
  const ssknIconShadowRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ssknIconRef.current && ssknIconShadowRef.current) {
      ssknIconRef.current.rotation.y += delta * 2;
      ssknIconShadowRef.current.rotation.y += delta * 2;
    }
  });
  return (
    <>
      <mesh
        scale={[2.5, 2.3, 0]}
        position={[-1.5, 0.9, 0]}
        ref={ssknIconRef}
        renderOrder={4}
      >
        <planeBufferGeometry attach="geometry" />
        <meshBasicMaterial
          map={icon}
          transparent={true}
          side={DoubleSide}
          depthTest={false}
        />
      </mesh>
      <mesh
        scale={[4.5, 4.2, 0]}
        position={[-1, -1, 0]}
        renderOrder={2}
        ref={ssknIconShadowRef}
      >
        <planeBufferGeometry attach="geometry" />
        <meshBasicMaterial
          map={icon}
          transparent={true}
          side={DoubleSide}
          depthTest={false}
          color={0x000000}
        />
      </mesh>
    </>
  );
};

export default memo(SsknIcon);
