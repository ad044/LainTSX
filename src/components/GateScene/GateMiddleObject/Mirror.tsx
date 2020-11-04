import React, { useMemo, useRef } from "react";
import gateMirrorTexture from "../../../static/sprite/gate_object_texture.png";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";

const Mirror = () => {
  const gateMirrorTex = useLoader(THREE.TextureLoader, gateMirrorTexture);
  const mirrorRef = useRef<THREE.Object3D>();

  const textureMemo = useMemo(() => {
    gateMirrorTex.wrapS = THREE.RepeatWrapping;
    gateMirrorTex.wrapT = THREE.RepeatWrapping;

    return gateMirrorTex;
  }, [gateMirrorTex]);

  useFrame(() => {
    if (mirrorRef.current) {
      mirrorRef.current.rotation.y += 0.03;
    }
  });

  return (
    <group ref={mirrorRef} position={[-0.1, -0.2, -0.2]}>
      <mesh renderOrder={4} position={[0.2, 0.2, 0.2]} scale={[0.4, 1, 0.05]}>
        <boxBufferGeometry attach="geometry"></boxBufferGeometry>
        <meshBasicMaterial
          attach="material"
          map={textureMemo}
          transparent={true}
          depthTest={false}
        ></meshBasicMaterial>
      </mesh>
    </group>
  );
};

export default Mirror;
