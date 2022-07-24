import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { UniformsLib, UniformsUtils, DoubleSide } from "three";
import { GameSite } from "@/types";
import { useTexture } from "@react-three/drei";
import { getLevelDigits } from "@/utils/site";
import vertex from "@/shaders/purple_ring.vert";
import fragment from "@/shaders/purple_ring.frag";

type PurpleRingProps = {
  level: number;
  site: GameSite;
};

const PurpleRing = (props: PurpleRingProps) => {
  const siteA = useTexture("/sprites/main/site_a.png");
  const siteB = useTexture("/sprites/main/site_b.png");
  const siteLevels = useTexture("/sprites/main/site_levels.png");

  const purpleRingRef = useRef<THREE.Mesh>(null);

  const levelTextureOffsets = useMemo(() => {
    const offsets = [
      0.031, 0.026, 0.0218, 0.0176, 0.0131, 0.009, 0.005, 0.001, 0.039, 0.035,
    ];

    const [firstDigit, secondDigit] = getLevelDigits(props.level);
    return [offsets[firstDigit], offsets[secondDigit]];
  }, [props.level]);

  const uniforms = useMemo(() => {
    const uniform = UniformsUtils.merge([UniformsLib["lights"]]);

    uniform.tex = { type: "t", value: null };
    uniform.siteLevels = { type: "t", value: siteLevels };
    uniform.siteLevelFirstCharacterOffset = {
      value: levelTextureOffsets[0],
    };
    uniform.siteLevelSecondCharacterOffset = {
      value: levelTextureOffsets[1],
    };

    return uniform;
  }, [siteLevels, levelTextureOffsets]);

  const matRef = useRef<THREE.ShaderMaterial>(null);

  const siteTexture = useMemo(() => {
    switch (props.site) {
      case GameSite.A:
        return siteA;
      case GameSite.B:
        return siteB;
    }
  }, [props.site, siteA, siteB]);

  useFrame((state, delta) => {
    purpleRingRef.current!.rotation.y += delta / 3;
  });

  useEffect(() => {
    if (matRef.current) {
      matRef.current.uniforms.tex.value = siteTexture;
      matRef.current.uniformsNeedUpdate = true;
    }
  }, [siteTexture, props.site, siteA, siteB]);

  return (
    <mesh
      position={[0, 0.44, 0]}
      scale={[26, 26, 26]}
      renderOrder={1}
      ref={purpleRingRef}
    >
      <cylinderBufferGeometry
        args={[0.05, 0.05, 0.0035, 64, 64, true]}
        attach="geometry"
      />
      <shaderMaterial
        side={DoubleSide}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent={true}
        uniforms={uniforms}
        lights={true}
        ref={matRef}
      />
    </mesh>
  );
};

export default memo(PurpleRing);
