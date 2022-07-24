import React, { useMemo, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { GLTF } from "three-stdlib/loaders/GLTFLoader";
import { RepeatWrapping } from "three";
import { useFrame } from "@react-three/fiber";

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
  position: [number, number, number];
  rotation?: [number, number, number];
};

const Mirror = (props: MirrorProps) => {
  const mirror = useTexture("/sprites/gate/gate_object_texture.png");
  const { nodes } = useGLTF("models/gate_mirror.glb") as GLTFResult;

  const mirrorGroupRef = useRef<THREE.Group>(null);

  const texture = useMemo(() => {
    mirror.wrapS = mirror.wrapT = RepeatWrapping;
    return mirror;
  }, [mirror]);

  useFrame((_, delta) => {
    if (mirrorGroupRef.current) {
      mirrorGroupRef.current.rotation.y -= delta * 1.5;
      texture.offset.x -= 0.1 * delta;
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
            rotation={props.rotation ?? [0, 0, 0]}
            renderOrder={4}
            position={props.position}
          >
            <meshBasicMaterial
              transparent={true}
              map={texture}
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
