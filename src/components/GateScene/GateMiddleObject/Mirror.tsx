import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import mirrorTexture from "../../../static/sprite/gate_object_texture.png";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

type GLTFResult = GLTF & {
  nodes: {
    GatePass: THREE.Mesh;
  };
  materials: {
    Material: THREE.MeshStandardMaterial;
  };
};

type MirrorProps = {
  visible: boolean;
  position: number[];
  rotation?: number[];
};

const Mirror = (props: MirrorProps) => {
  const mirrorTex = useLoader(THREE.TextureLoader, mirrorTexture);
  const { nodes } = useLoader<GLTFResult>(GLTFLoader, "models/gatePass.glb");

  const mirrorGroupRef = useRef<THREE.Object3D>();
  const materialRef = useRef<THREE.MeshBasicMaterial>();

  const tex = useMemo(() => {
    mirrorTex.wrapS = mirrorTex.wrapT = THREE.RepeatWrapping;
    return mirrorTex;
  }, [mirrorTex]);

  useFrame(() => {
    if (mirrorGroupRef.current) {
      mirrorGroupRef.current.rotation.y -= 0.03;
    }
    if (materialRef.current) {
      tex.offset.x -= 0.0025;
    }
  });

  return (
    <>
      <group position={[0, 0, -0.5]}>
        <group
          ref={mirrorGroupRef}
          position={[0, 0, 0.2]}
          scale={[0.8, 0.8, 1]}
        >
          <mesh
            geometry={nodes.GatePass.geometry}
            scale={[0.01, 0.6, 0.2]}
            rotation={
              props.rotation
                ? (props.rotation as [number, number, number])
                : [0, 0, 0]
            }
            renderOrder={4}
            position={props.position as [number, number, number]}
          >
            <meshBasicMaterial
              ref={materialRef}
              attach="material"
              transparent={true}
              map={mirrorTex}
              depthTest={false}
              visible={props.visible}
            />
          </mesh>
        </group>
      </group>
    </>
  );
};

export default Mirror;
