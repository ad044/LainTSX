import React, { useMemo, useRef } from "react";
import blueBinary from "../../static/sprite/blue_binary.png";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";

const GateSide = () => {
  const blueBinaryTex = useLoader(THREE.TextureLoader, blueBinary);

  const texture = useMemo(() => {
    blueBinaryTex.wrapS = THREE.RepeatWrapping;
    blueBinaryTex.wrapT = THREE.RepeatWrapping;
    blueBinaryTex.repeat.set(5, 5);

    return blueBinaryTex;
  }, [blueBinaryTex]);

  useFrame(() => {
    if (Date.now() % 2 === 0) {
      texture.offset.y += 0.5;
    }
  });
  return (
    <>
      <mesh
        rotation={[0, 0.2, 0]}
        position={[-1.7, 0, 1.5]}
        scale={[3, 1.5, 0]}
      >
        <planeBufferGeometry attach="geometry"></planeBufferGeometry>
        <meshBasicMaterial
          attach="material"
          map={texture}
          transparent={true}
          opacity={0.6}
        />
      </mesh>
      <mesh
        rotation={[0, -0.2, 0]}
        position={[1.7, 0, 1.5]}
        scale={[3, 1.5, 0]}
      >
        <planeBufferGeometry attach="geometry"></planeBufferGeometry>
        <meshBasicMaterial
          attach="material"
          map={texture}
          transparent={true}
          opacity={0.6}
        />
      </mesh>
    </>
  );
};

export default GateSide;
