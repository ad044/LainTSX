import React, { useRef } from "react";
import { useTexture } from "@react-three/drei";
import { TextType } from "@/types";
import TextRenderer from "../TextRenderer/TextRenderer";
import useCappedFrame from "@/hooks/useCappedFrame";

type GateMiddleProps = {
  intro: boolean;
  gateLvl: number;
};

const GateHUD = (props: GateMiddleProps) => {
  const gatePass = useTexture("/sprites/gate/gate_pass.png");
  const gatePassUnderline = useTexture("/sprites/gate/gate_pass_underline.png");
  const gateAccessPass = useTexture("/sprites/gate/you_got_an_access_pass.png");
  const changeSiteEnable = useTexture("/sprites/gate/change_site_enable.png");
  const gateLeftThing = useTexture("/sprites/gate/left_gate_thing.png");
  const gateRightThing = useTexture("/sprites/gate/right_gate_thing.png");

  const pressAnyTextRef = useRef<THREE.Group>(null);

  useCappedFrame(() => {
    if (pressAnyTextRef.current) {
      pressAnyTextRef.current.visible = !pressAnyTextRef.current.visible;
    }
  }, 0.5);

  return (
    <>
      <sprite scale={[1.5, 0.24, 0]} position={[0, 1.1, 0.07]} renderOrder={3}>
        <spriteMaterial map={gatePass} transparent={true} depthTest={false} />
      </sprite>

      <sprite scale={[4.2, 0.01, 0]} position={[0, 0.98, 0.07]} renderOrder={3}>
        <spriteMaterial
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
          map={changeSiteEnable}
          transparent={true}
          depthTest={false}
        />
      </sprite>

      <sprite scale={[4.2, 0.01, 0]} position={[0, 0.79, 0.07]} renderOrder={3}>
        <spriteMaterial
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
          map={gateLeftThing}
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
          map={gateRightThing}
          transparent={true}
          depthTest={false}
          visible={!props.intro && props.gateLvl === 4}
        />
      </sprite>

      <sprite scale={[1.25, 0.31, 1]} position={[0, -0.8, 0.2]} renderOrder={3}>
        <spriteMaterial
          map={gateAccessPass}
          transparent={true}
          depthTest={false}
          visible={!props.intro && props.gateLvl === 4}
        />
      </sprite>

      {!props.intro && (
        <group ref={pressAnyTextRef} position={[-0.6, -1, 0]}>
          <TextRenderer
            type={TextType.MediumOrange}
            text={"press ANY button"}
            scale={[0.09, 0.12, 0]}
            renderOrder={100}
            depthTest={false}
          />
        </group>
      )}
    </>
  );
};

export default GateHUD;
