import React, { memo, useRef } from "react";
import ssknIcon from "../../static/sprite/SSkn_icon.png";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";

const SSknIcon = memo(() => {
  const ssknIconTex = useLoader(THREE.TextureLoader, ssknIcon);
  const ssknIconRef = useRef<THREE.Object3D>();
  const ssknIconShadowRef = useRef<THREE.Object3D>();

  useFrame(() => {
    if (ssknIconRef.current && ssknIconShadowRef.current) {
      ssknIconRef.current.rotation.y += 0.03;
      ssknIconShadowRef.current.rotation.y += 0.03;
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
          attach="material"
          map={ssknIconTex}
          transparent={true}
          side={THREE.DoubleSide}
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
          attach="material"
          map={ssknIconTex}
          transparent={true}
          side={THREE.DoubleSide}
          depthTest={false}
          color={0x000000}
        />
      </mesh>
    </>
  );
});

export default SSknIcon;
