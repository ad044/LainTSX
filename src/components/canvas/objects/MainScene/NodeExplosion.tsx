import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import nodeExplosionLinesJson from "@/json/node_explosion_lines.json";
import { NodeData } from "@/types";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib/loaders/GLTFLoader";
import useNodeTexture from "@/hooks/useNodeTexture";
import useCappedFrame from "@/hooks/useCappedFrame";

import { Color } from "three";
import vertex from "@/shaders/explosion_line.vert";
import fragment from "@/shaders/explosion_line.frag";
import { Position, Rotation } from "@/types";

export type ExplosionLineProps = {
  rotation: Rotation;
  position: Position;
  color: string;
  length: number;
};

const ExplosionLine = (props: ExplosionLineProps) => {
  const uniforms = useMemo(
    () => ({
      color1: {
        value: new Color(0xfff),
      },
      color2: {
        value: new Color(props.color),
      },
    }),
    [props.color]
  );

  return (
    <mesh
      rotation={props.rotation}
      position={props.position}
      scale={[0.01, props.length, 0]}
      renderOrder={2}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <shaderMaterial
        fragmentShader={fragment}
        vertexShader={vertex}
        transparent={true}
        depthWrite={false}
        uniforms={uniforms}
      />
    </mesh>
  );
};

type GLTFResult = GLTF & {
  nodes: {
    Cube: THREE.Mesh;
  };
  materials: {
    Material: THREE.MeshStandardMaterial;
  };
};

type NodeExplosionProps = {
  node: NodeData;
};

const NodeExplosion = (props: NodeExplosionProps) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [shouldRotate, setShouldRotate] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  const { nodes } = useGLTF("models/gold_node.glb") as GLTFResult;
  const { goldTexture, normalTexture } = useNodeTexture(props.node.type);

  const goldNodeRef = useRef<THREE.Mesh>(null);

  const linePoses: ExplosionLineProps[] = useMemo(
    () => nodeExplosionLinesJson[currentFrame] as ExplosionLineProps[],
    [currentFrame]
  );

  useCappedFrame(() => {
    if (shouldAnimate && currentFrame < 5) {
      setCurrentFrame(currentFrame + 1);
    }
  }, 0.1);

  useFrame((_, delta) => {
    if (goldNodeRef.current && shouldRotate) {
      goldNodeRef.current.rotation.y -= delta * 2;
      goldNodeRef.current.rotation.z += delta * 2;
    }
  });

  useEffect(() => {
    if (goldNodeRef.current && !shouldRotate) {
      goldNodeRef.current.rotation.x = Math.PI / 2;
      goldNodeRef.current.rotation.y = 0;
      goldNodeRef.current.rotation.z = Math.PI / 2 - 0.3;
    }
  }, [shouldRotate]);

  useEffect(() => {
    setShouldRotate(true);
    setTimeout(() => setShouldAnimate(true), 1100);
  }, []);

  return (
    <>
      <group visible={shouldAnimate} scale={[1.2, 1.2, 1.2]}>
        {Object.values(linePoses).map((entry, idx) => (
          <ExplosionLine
            rotation={entry.rotation}
            position={entry.position}
            color={entry.color}
            length={entry.length}
            key={idx}
          />
        ))}
      </group>
      <group position={[0, -0.45, 0]}>
        <mesh
          geometry={nodes.Cube.geometry}
          rotation={[Math.PI / 2, 0, Math.PI / 2 - 0.3]}
          scale={[-0.1 / 1.15, 0.2 / 1.35, 0.1 / 1.15]}
          ref={goldNodeRef}
        >
          <meshBasicMaterial
            map={shouldAnimate ? goldTexture : normalTexture}
            transparent={true}
          />
        </mesh>
      </group>
    </>
  );
};

export default NodeExplosion;
