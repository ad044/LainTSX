import React, { memo } from "react";
import body from "../../static/sprites/polytan/body.png";
import head from "../../static/sprites/polytan/head.png";
import leftLeg from "../../static/sprites/polytan/left_leg.png";
import leftArm from "../../static/sprites/polytan/left_arm.png";
import rightArm from "../../static/sprites/polytan/right_arm.png";
import rightLeg from "../../static/sprites/polytan/right_leg.png";
import skeleton from "../../static/sprites/polytan/polytan_skeleton.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import { useStore } from "../../store";

const PolytanBear = memo(() => {
  const skeletonTex = useLoader(THREE.TextureLoader, skeleton);
  const headTex = useLoader(THREE.TextureLoader, head);
  const bodyTex = useLoader(THREE.TextureLoader, body);
  const leftArmTex = useLoader(THREE.TextureLoader, leftArm);
  const leftLegTex = useLoader(THREE.TextureLoader, leftLeg);
  const rightArmTex = useLoader(THREE.TextureLoader, rightArm);
  const rightLegTex = useLoader(THREE.TextureLoader, rightLeg);

  const unlockedParts = useStore(
    (state) => state.gameProgress.polytan_unlocked_parts
  );

  return (
    <>
      <sprite scale={[4, 5, 0]} position={[0, -0.4, 0]}>
        <spriteMaterial attach="material" map={skeletonTex} />
      </sprite>

      <sprite scale={[2.1, 1.9, 0]} position={[-0.05, -1, 0]}>
        <spriteMaterial
          attach="material"
          map={bodyTex}
          visible={unlockedParts.body}
        />
      </sprite>

      <sprite scale={[2.5, 2.5, 0]} position={[-0.05, 0.8, 0]}>
        <spriteMaterial
          attach="material"
          map={headTex}
          visible={unlockedParts.head}
        />
      </sprite>
      <sprite scale={[1.9, 1, 0]} position={[1, -2.2, 0]}>
        <spriteMaterial
          attach="material"
          map={leftLegTex}
          visible={unlockedParts.left_leg}
        />
      </sprite>
      <sprite scale={[1.5, 1.9, 0]} position={[1.2, -0.4, 0]}>
        <spriteMaterial
          attach="material"
          map={leftArmTex}
          visible={unlockedParts.left_arm}
        />
      </sprite>
      <sprite scale={[1.6, 2, 0]} position={[-1.2, -1.2, 0]}>
        <spriteMaterial
          attach="material"
          map={rightArmTex}
          visible={unlockedParts.right_arm}
        />
      </sprite>
      <sprite scale={[1.9, 1, 0]} position={[-1, -2.2, 0]}>
        <spriteMaterial
          attach="material"
          map={rightLegTex}
          visible={unlockedParts.right_leg}
        />
      </sprite>
    </>
  );
});

export default PolytanBear;
