import React from "react";
import { useTexture } from "@react-three/drei";

const PolytanBackground = () => {
  const header = useTexture("/sprites/polytan/polytan_header.png");
  const background = useTexture("/sprites/polytan/polytan_background.png");
  const leftArm = useTexture("/sprites/polytan/poly_larm_hud.png");
  const rightArm = useTexture("/sprites/polytan/poly_rarm_hud.png");
  const rightLeg = useTexture("/sprites/polytan/poly_rleg_hud.png");
  const leftLeg = useTexture("/sprites/polytan/poly_lleg_hud.png");
  const head = useTexture("/sprites/polytan/poly_head_hud.png");
  const body = useTexture("/sprites/polytan/poly_body_hud.png");

  return (
    <>
      <sprite scale={[4, 4, 0]} position={[3.5, 2, 0]} renderOrder={-1}>
        <spriteMaterial map={header} />
      </sprite>
      <sprite scale={[4, 4, 0]} position={[-3.5, -2, 0]} renderOrder={-1}>
        <spriteMaterial map={background} />
      </sprite>
      <sprite scale={[3.5, 1, 0]} position={[2.8, 0.5, 0]} renderOrder={2}>
        <spriteMaterial map={leftArm} />
      </sprite>
      <sprite scale={[3.5, 1.5, 0]} position={[-3, -0.8, 0]} renderOrder={2}>
        <spriteMaterial map={rightArm} />
      </sprite>
      <sprite scale={[3.5, 1.5, 0]} position={[2.4, -1.4, 0]} renderOrder={2}>
        <spriteMaterial map={leftLeg} />
      </sprite>
      <sprite scale={[3, 0.8, 0]} position={[-3, -2.8, 0]} renderOrder={2}>
        <spriteMaterial map={rightLeg} />
      </sprite>
      <sprite scale={[3.4, 1, 0]} position={[-1.5, 2.3, 0]} renderOrder={2}>
        <spriteMaterial map={head} />
      </sprite>
      <sprite scale={[3.4, 1, 0]} position={[1.5, -2.2, 0]} renderOrder={2}>
        <spriteMaterial map={body} />
      </sprite>
    </>
  );
};

export default PolytanBackground;
