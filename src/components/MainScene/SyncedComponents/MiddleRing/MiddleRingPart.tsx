import React, { useMemo } from "react";
import middleRingTexture from "../../../../static/sprite/middle_ring_tex.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import { a, useSpring } from "@react-spring/three";
import { useMiddleRingStore } from "../../../../store";

type MiddleRingPartProps = {
  position: number[];
  rotation: number[];
};

const MiddleRingPart = (props: MiddleRingPartProps) => {
  const partSeparatorVal = useMiddleRingStore(
    (state) => state.partSeparatorVal
  );

  const middleRingTex = useLoader(THREE.TextureLoader, middleRingTexture);

  const middleRingPartTex = useMemo(() => {
    middleRingTex.repeat.set(0.4, 1);
    return middleRingTex;
  }, [middleRingTex]);

  const partPosState = useSpring({
    posX: props.position[0] / partSeparatorVal,
    posZ: props.position[2] / partSeparatorVal,
    config: { duration: 600 },
  });

  return (
    <a.group
      position-x={partPosState.posX}
      position-z={partPosState.posZ}
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
