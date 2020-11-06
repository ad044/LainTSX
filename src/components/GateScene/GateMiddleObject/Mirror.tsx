import React, { useMemo, useRef } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import mirrorTexture from "../../../static/sprite/gate_object_texture.png";

const Mirror = () => {
  const tex1 = useLoader(THREE.TextureLoader, mirrorTexture);

  const texture = useMemo(() => {
    let repeatX, repeatY;
    tex1.wrapS = THREE.RepeatWrapping;
    tex1.wrapT = THREE.RepeatWrapping;
    repeatX = 88 / 256;
    repeatY = 1;
    tex1.repeat.set(repeatX, repeatY);
    return tex1;
  }, [tex1]);

  const mirrorRef = useRef<THREE.Object3D>();
  const materialRef = useRef<THREE.MeshBasicMaterial>();

  useFrame(() => {
    if (mirrorRef.current) {
      mirrorRef.current.rotation.y -= 0.03;
    }
    if (materialRef.current) {
      texture.offset.x += 0.01;
    }
  });

  return (
    <>
      <group ref={mirrorRef} position={[-0.1, -0.2, -0.2]}>
        <mesh renderOrder={4} position={[0.2, 0.2, 0.2]} scale={[0.4, 1, 0.05]}>
          <boxBufferGeometry attach="geometry" />
          <meshBasicMaterial
            ref={materialRef}
            attach="material"
            map={texture}
            transparent={true}
            depthTest={false}
          />
        </mesh>
      </group>
    </>
  );
};

export default Mirror;
