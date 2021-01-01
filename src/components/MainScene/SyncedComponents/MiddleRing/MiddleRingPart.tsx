import React, { useMemo } from "react";
import middleRingTexture from "../../../../static/sprite/middle_ring_tex.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import { a } from "@react-spring/three";

type MiddleRingPartProps = {
  position: number[];
  rotation: number[];
};

const MiddleRingPart = (props: MiddleRingPartProps) => {
  const middleRingTex = useLoader(THREE.TextureLoader, middleRingTexture);

  const middleRingPartTex = useMemo(() => {
    middleRingTex.repeat.set(0.4, 1);
    return middleRingTex;
  }, [middleRingTex]);

  return (
    <group
      position={props.position as [number, number, number]}
      rotation={props.rotation as [number, number, number]}
    >
      <a.mesh scale={[0.16, 0.032, 0]}>
        <planeBufferGeometry attach="geometry" />
        <meshBasicMaterial
          attach="material"
          map={middleRingPartTex}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </a.mesh>
    </group>
  );
};

export default MiddleRingPart;
