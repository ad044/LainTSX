import React, { useEffect, useMemo } from "react";
import middleRingTexture from "../../../../static/sprite/middle_ring_tex.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import { a, useSpring } from "@react-spring/three";
import { useStore } from "../../../../store";

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

  const [{ posX, posZ }, set] = useSpring(() => ({
    posX:
      props.position[0] /
      useStore.getState().middleRingPartSeparatorVal,
    posZ:
      props.position[2] /
      useStore.getState().middleRingPartSeparatorVal,

    config: { duration: 600 },
  }));

  useEffect(() => {
    useStore.subscribe(set, (state) => ({
      posX: props.position[0] / state.middleRingPartSeparatorVal,
      posZ: props.position[2] / state.middleRingPartSeparatorVal,
    }));
  }, [props.position, set]);

  return (
    <a.group
      position-x={posX}
      position-z={posZ}
      position-y={props.position[1]}
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
    </a.group>
  );
};

export default MiddleRingPart;
