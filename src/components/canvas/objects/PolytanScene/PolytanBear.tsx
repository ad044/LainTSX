import React, { memo } from "react";
import { useStore } from "@/store";
import { useTexture } from "@react-three/drei";

const PolytanBear = () => {
  const skeleton = useTexture("/sprites/polytan/polytan_skeleton.png");
  const head = useTexture("/sprites/polytan/head.png");
  const body = useTexture("/sprites/polytan/body.png");
  const leftArm = useTexture("/sprites/polytan/left_arm.png");
  const leftLeg = useTexture("/sprites/polytan/left_leg.png");
  const rightArm = useTexture("/sprites/polytan/right_arm.png");
  const rightLeg = useTexture("/sprites/polytan/right_leg.png");

  const unlockedParts = useStore(
    (state) => state.gameProgress.polytan_unlocked_parts
  );

  return (
    <>
      <sprite scale={[4, 5, 0]} position={[0, -0.4, 0]}>
        <spriteMaterial map={skeleton} />
      </sprite>

      <sprite scale={[2.1, 1.9, 0]} position={[-0.05, -1, 0]}>
        <spriteMaterial map={body} visible={unlockedParts.body} />
      </sprite>

      <sprite scale={[2.5, 2.5, 0]} position={[-0.05, 0.8, 0]}>
        <spriteMaterial map={head} visible={unlockedParts.head} />
      </sprite>
      <sprite scale={[1.9, 1, 0]} position={[1, -2.2, 0]}>
        <spriteMaterial map={leftLeg} visible={unlockedParts.left_leg} />
      </sprite>
      <sprite scale={[1.5, 1.9, 0]} position={[1.2, -0.4, 0]}>
        <spriteMaterial map={leftArm} visible={unlockedParts.left_arm} />
      </sprite>
      <sprite scale={[1.6, 2, 0]} position={[-1.2, -1.2, 0]}>
        <spriteMaterial map={rightArm} visible={unlockedParts.right_arm} />
      </sprite>
      <sprite scale={[1.9, 1, 0]} position={[-1, -2.2, 0]}>
        <spriteMaterial map={rightLeg} visible={unlockedParts.right_leg} />
      </sprite>
    </>
  );
};

export default memo(PolytanBear);
