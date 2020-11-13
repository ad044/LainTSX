import React, { useMemo, useRef } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import mirrorTexture from "../../../static/sprite/gate_object_texture.png";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useGLTF } from "@react-three/drei/useGLTF";

type GLTFResult = GLTF & {
  nodes: {
    GatePass: THREE.Mesh;
  };
  materials: {
    Material: THREE.MeshStandardMaterial;
  };
};

const Mirror = () => {
  const mirrorTex = useLoader(THREE.TextureLoader, mirrorTexture);
  const { nodes } = useLoader<GLTFResult>(GLTFLoader, "models/gatePass.glb");

  const mirrorRef = useRef<THREE.Object3D>();
  const materialRef = useRef<THREE.MeshBasicMaterial>();

  const tex = useMemo(() => {
    mirrorTex.wrapS = mirrorTex.wrapT = THREE.RepeatWrapping;
    return mirrorTex;
  }, [mirrorTex]);

  useFrame(() => {
    if (mirrorRef.current) {
      mirrorRef.current.rotation.y -= 0.03;
    }
    if (materialRef.current) {
      tex.offset.y -= 0.01;
    }
  });

  return (
    <>
      <group ref={mirrorRef} position={[0, 0, 0.2]}>
        <mesh
          geometry={nodes.GatePass.geometry}
          scale={[0.01, 0.6, 0.2]}
          rotation={[0, Math.PI / 2, 0]}
          renderOrder={4}
          position={[0, 0, -0.2]}
        >
          <meshBasicMaterial
            ref={materialRef}
            attach="material"
            transparent={true}
            map={mirrorTex}
            depthTest={false}
          />
        </mesh>
      </group>

      {/*<mesh renderOrder={4} position={[0.2, 0.2, 0.2]} scale={[0.4, 1, 0.05]}>*/}
      {/*  <boxBufferGeometry attach="geometry" />*/}
      {/*</mesh>*/}
    </>
  );
};

export default Mirror;
