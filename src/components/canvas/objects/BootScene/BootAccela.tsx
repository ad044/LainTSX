import React, { useState } from "react";
import { useFrame } from "@react-three/fiber";
import { PlainAnimator } from "three-plain-animator/lib/plain-animator";
import { useTexture } from "@react-three/drei";

type BootAccelaProps = {
  visible: boolean;
};

const BootAccela = (props: BootAccelaProps) => {
  const accelaBoot = useTexture(
    "/sprites/boot/login_intro_accela_spritesheet.png"
  );
  const makeMeSad = useTexture("/sprites/boot/make_me_sad.png");

  const [animator] = useState(() => {
    const anim = new PlainAnimator(accelaBoot, 10, 3, 29, 60);
    anim.init(0);
    return anim;
  });

  useFrame(() => {
    animator.animate();
  });

  return (
    <>
      <sprite
        scale={[0.35, 0.6, 0.35]}
        position={[0, 0.2, 0]}
        visible={props.visible}
      >
        <spriteMaterial map={accelaBoot} />
      </sprite>
      <sprite
        scale={[0.4, 0.6, 0.4]}
        position={[0, -0.5, 0]}
        visible={props.visible}
      >
        <spriteMaterial map={makeMeSad} />
      </sprite>
    </>
  );
};

export default BootAccela;
