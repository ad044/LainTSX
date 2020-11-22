import React from "react";
import body from "../../static/sprite/body.png";
import head from "../../static/sprite/head.png";
import leftLeg from "../../static/sprite/left_leg.png";
import leftArm from "../../static/sprite/left_arm.png";
import rightArm from "../../static/sprite/right_arm.png";
import rightLeg from "../../static/sprite/right_leg.png";
import skeleton from "../../static/sprite/polytan_skeleton.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";

type PolytanBearProps = {
  unlockedParts: {
    body: boolean;
    head: boolean;
    leftArm: boolean;
    rightArm: boolean;
    leftLeg: boolean;
    rightLeg: boolean;
  };
};

const PolytanBear = (props: PolytanBearProps) => {
  const skeletonTex = useLoader(THREE.TextureLoader, skeleton);
  const headTex = useLoader(THREE.TextureLoader, head);
  const bodyTex = useLoader(THREE.TextureLoader, body);
  const leftArmTex = useLoader(THREE.TextureLoader, leftArm);
  const leftLegTex = useLoader(THREE.TextureLoader, leftLeg);
  const rightArmTex = useLoader(THREE.TextureLoader, rightArm);
  const rightLegTex = useLoader(THREE.TextureLoader, rightLeg);

  return (
    <>
      <sprite scale={[4, 5, 0]} position={[0, -0.4, 0]}>
        <spriteMaterial attach="material" map={skeletonTex} />
      </sprite>

      <sprite scale={[2.1, 1.9, 0]} position={[-0.05, -1, 0]}>
        <spriteMaterial
          attach="material"
          map={bodyTex}
          visible={props.unlockedParts.body}
        />
      </sprite>

      <sprite scale={[2.5, 2.5, 0]} position={[-0.05, 0.8, 0]}>
        <spriteMaterial
          attach="material"
          map={headTex}
          visible={props.unlockedParts.head}
        />
      </sprite>
      <sprite scale={[1.9, 1, 0]} position={[1, -2.2, 0]}>
        <spriteMaterial
          attach="material"
          map={leftLegTex}
          visible={props.unlockedParts.leftLeg}
        />
      </sprite>
      <sprite scale={[1.5, 1.9, 0]} position={[1.2, -0.4, 0]}>
        <spriteMaterial
          attach="material"
          map={leftArmTex}
          visible={props.unlockedParts.leftArm}
        />
      </sprite>
      <sprite scale={[1.6, 2, 0]} position={[-1.2, -1.2, 0]}>
        <spriteMaterial
          attach="material"
          map={rightArmTex}
          visible={props.unlockedParts.rightArm}
        />
      </sprite>
      <sprite scale={[1.9, 1, 0]} position={[-1, -2.2, 0]}>
        <spriteMaterial
          attach="material"
          map={rightLegTex}
          visible={props.unlockedParts.rightLeg}
        />
      </sprite>
    </>
  );
};

export default PolytanBear;
