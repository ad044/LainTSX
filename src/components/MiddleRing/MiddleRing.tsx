import React, { memo, useMemo } from "react";
import { useFrame, useLoader, useThree } from "react-three-fiber";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import middleRingTexture from "../../static/sprites/middle_ring_tex.png";

import { draco } from "drei";
import * as THREE from "three";

type GLTFResult = GLTF & {
  nodes: {
    BezierCircle: THREE.Mesh;
  };
  materials: {
    ["Material.001"]: THREE.MeshStandardMaterial;
  };
};

const MiddleRing = memo(() => {
  const { nodes, materials } = useLoader<GLTFResult>(
    GLTFLoader,
    "/models/ring2.glb",
    draco("/draco-gltf/")
  );

  const middleRingTex = useLoader(THREE.TextureLoader, middleRingTexture);

  const uniforms = {
    tex: { type: "t", value: middleRingTex },
  };

  const vertexShader = `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform sampler2D tex;

    varying vec2 vUv;

    void main() {
        gl_FragColor = texture2D(tex, vUv);
        gl_FragColor.a = 0.5;
    }
  `;

  // -0.15, 03
  return (
    <group>
      <mesh
        material={materials["Material.001"]}
        geometry={nodes.BezierCircle.geometry}
        position={[0, -0.15, 0.3]}
        scale={[0.8, 0.5, 0.8]}
      >
        <shaderMaterial
          attach="material"
          color={0x8cffde}
          side={THREE.DoubleSide}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent={true}
        />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
});

export default MiddleRing;
