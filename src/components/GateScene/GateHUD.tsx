import React from "react";
import gateText from "../../static/sprite/gate_pass.png";
import gateTextUnderline from "../../static/sprite/gate_pass_underline.png";
import gateTextAccessPass from "../../static/sprite/you_got_an_access_pass.png";
import changeSiteEnable from "../../static/sprite/change_site_enable.png";
import gateLeftThing from "../../static/sprite/left_gate_thing.png";
import gateRightThing from "../../static/sprite/right_gate_thing.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import GateMiddleObject from "./GateMiddleObject";

type GateMiddleProps = {
  intro: boolean;
  gateLvl: number;
};

const GateHUD = (props: GateMiddleProps) => {
  const gatePassTexture = useLoader(THREE.TextureLoader, gateText);
  const gatePassUnderline = useLoader(THREE.TextureLoader, gateTextUnderline);
  const gateAccessPassTexture = useLoader(
    THREE.TextureLoader,
    gateTextAccessPass
  );
  const changeSiteEnableTexture = useLoader(
    THREE.TextureLoader,
    changeSiteEnable
  );

  const gateLeftThingTexture = useLoader(THREE.TextureLoader, gateLeftThing);
  const gateRightThingTexture = useLoader(THREE.TextureLoader, gateRightThing);

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

      <sprite
        scale={[1.6, 0.1, 1]}
        position={[0, 0.8, 0.2]}
        renderOrder={3}
        visible={!props.intro && props.gateLvl === 4}
      >
        <spriteMaterial
          attach="material"
          map={changeSiteEnableTexture}
          transparent={true}
          depthTest={false}
        />
      </sprite>

      <sprite scale={[4.2, 0.01, 0]} position={[0, 0.79, 0.07]} renderOrder={3}>
        <spriteMaterial
          attach="material"
          map={gatePassUnderline}
          transparent={true}
          depthTest={false}
          visible={!props.intro && props.gateLvl === 4}
        />
      </sprite>

      <sprite
        scale={[0.7, 0.35, 1]}
        position={[-0.8, -0.8, 0.2]}
        renderOrder={3}
      >
        <spriteMaterial
          attach="material"
          map={gateLeftThingTexture}
          transparent={true}
          depthTest={false}
          visible={!props.intro && props.gateLvl === 4}
        />
      </sprite>

      <sprite
        scale={[0.7, 0.35, 1]}
        position={[0.8, -0.8, 0.2]}
        renderOrder={3}
      >
        <spriteMaterial
          attach="material"
          map={gateRightThingTexture}
          transparent={true}
          depthTest={false}
          visible={!props.intro && props.gateLvl === 4}
        />
      </sprite>

      <sprite scale={[1.25, 0.31, 1]} position={[0, -0.8, 0.2]} renderOrder={3}>
        <spriteMaterial
          attach="material"
          map={gateAccessPassTexture}
          transparent={true}
          depthTest={false}
          visible={!props.intro && props.gateLvl === 4}
        />
      </sprite>
    </>
  );
};

export default GateHUD;
