import React, { useMemo, useRef } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";

const Mirror = () => {

  const cubeTexture = useLoader(
    // @ts-ignore
    THREE.CubeTextureLoader,
    [
      "gate_object_texture_2.png",
      "gate_object_texture_2.png",
      "gate_object_texture_2.png",
      "gate_object_texture_2.png",
      "gate_object_texture_2.png",
      "gate_object_texture_2.png",
      "gate_object_texture_2.png",
    ],
    (loader: THREE.CubeTextureLoader) => loader.setPath("../../../static")
  );

  const mirrorMaterial = useMemo(() => {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      "gate_object_texture.png",
      "gate_object_texture.png",
      "gate_object_texture.png",
      "gate_object_texture.png",
      "gate_object_texture.png",
      "gate_object_texture.png",
    ]);
    return new THREE.MeshBasicMaterial({
      envMap: cubeTexture,
      depthTest: false,
      transparent: true,
    });
  }, []);

  const mirrorRef = useRef<THREE.Object3D>();

  useFrame(() => {
    if (mirrorRef.current) {
      mirrorRef.current.rotation.y += 0.03;
    }
    mirrorMaterial.needsUpdate = true;
  });

  return (
    <group ref={mirrorRef} position={[-0.1, -0.2, -0.2]}>
      <mesh
        renderOrder={4}
        position={[0.2, 0.2, 0.2]}
        scale={[0.4, 1, 0.05]}
        material={mirrorMaterial}
      >
        <boxBufferGeometry attach="geometry"></boxBufferGeometry>
      </mesh>
    </group>
  );
};

export default Mirror;
