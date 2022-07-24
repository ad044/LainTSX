import React, { memo, useMemo } from "react";
import { UniformsUtils, UniformsLib, DoubleSide } from "three";
import { useTexture } from "@react-three/drei";
import vertex from "@/shaders/gray_ring.vert";
import fragment from "@/shaders/gray_ring.frag";

const GrayRing = () => {
  const lof = useTexture("/sprites/main/gray_ring_lof.png");
  const hole = useTexture("/sprites/main/hole.png");
  const life = useTexture("/sprites/main/life.png");

  const uniforms = useMemo(() => {
    const uniform = UniformsUtils.merge([UniformsLib["lights"]]);
    uniform.lof = { type: "t", value: lof };
    uniform.hole = { type: "t", value: hole };
    uniform.life = { type: "t", value: life };

    return uniform;
  }, [hole, life, lof]);

  return (
    <mesh
      position={[0, -0.29, 0]}
      rotation={[0, 3.95, 0]}
      renderOrder={1}
      scale={[33, 33, 33]}
    >
      <cylinderBufferGeometry
        args={[0.036, 0.036, 0.003, 64, 64, true]}
        attach="geometry"
      />
      <shaderMaterial
        side={DoubleSide}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent={true}
        uniforms={uniforms}
        lights={true}
      />
    </mesh>
  );
};

export default memo(GrayRing);
