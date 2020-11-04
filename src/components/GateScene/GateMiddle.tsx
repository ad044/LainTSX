import React from "react";
import gateText from "../../static/sprite/gate_pass.png";
import gateTextUnderline from "../../static/sprite/gate_pass_underline.png";
import gateBlueBinarySingularOne from "../../static/sprite/blue_binary_singular_one.png";
import gateBlueBinarySingularZero from "../../static/sprite/blue_binary_singular_zero.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import GateMiddleObject from "./GateMiddleObject";

const GateMiddle = () => {
  const gatePassTexture = useLoader(THREE.TextureLoader, gateText);
  const gatePassUnderline = useLoader(THREE.TextureLoader, gateTextUnderline);

  return (
    <>
      <sprite scale={[1.5, 0.24, 0]} position={[0, 1.1, 0.07]} renderOrder={3}>
        <spriteMaterial
          attach="material"
          map={gatePassTexture}
          transparent={true}
          depthTest={false}
        />
      </sprite>

      <sprite scale={[4.2, 0.01, 0]} position={[0, 0.98, 0.07]} renderOrder={3}>
        <spriteMaterial
          attach="material"
          map={gatePassUnderline}
          transparent={true}
          depthTest={false}
        />
      </sprite>

      <GateMiddleObject />
    </>
  );
};

export default GateMiddle;
