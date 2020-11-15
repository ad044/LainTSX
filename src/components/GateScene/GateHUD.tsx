import React, { useEffect, useMemo, useRef, useState } from "react";
import gateText from "../../static/sprite/gate_pass.png";
import gateTextUnderline from "../../static/sprite/gate_pass_underline.png";
import gateTextAccessPass from "../../static/sprite/you_got_an_access_pass.png";
import changeSiteEnable from "../../static/sprite/change_site_enable.png";
import gateLeftThing from "../../static/sprite/left_gate_thing.png";
import gateRightThing from "../../static/sprite/right_gate_thing.png";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";

type GateMiddleProps = {
  intro: boolean;
  gateLvl: number;
};

const GateHUD = (props: GateMiddleProps) => {
  const wordFont = useLoader(THREE.FontLoader, "/3d_fonts/MediaWord.blob");
  const config = useMemo(
    () => ({
      font: wordFont,
      size: 1,
    }),
    [wordFont]
  );

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

  const pressAnyRef = useRef<THREE.Object3D>();

  useEffect(() => {
    setInterval(() => {
      if (pressAnyRef.current && !props.intro) {
        pressAnyRef.current.visible = !pressAnyRef.current.visible;
      }
    }, 500);
  }, [props.intro]);

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

      <group ref={pressAnyRef} visible={false}>
        <mesh
          scale={[0.17, 0.14, 0]}
          position={[-0.8, -1.3, 0]}
          renderOrder={5}
        >
          <textGeometry attach="geometry" args={["press ANY button", config]} />
          <meshBasicMaterial
            attach="material"
            color={0xdb9200}
            transparent={true}
            depthTest={false}
          />
        </mesh>
        <mesh
          scale={[0.17, 0.14, 0]}
          position={[-0.793, -1.308, 0]}
          renderOrder={4}
        >
          <textGeometry attach="geometry" args={["press ANY button", config]} />
          <meshBasicMaterial
            attach="material"
            color={0xad7400}
            transparent={true}
            depthTest={false}
          />
        </mesh>
      </group>
    </>
  );
};

export default GateHUD;
