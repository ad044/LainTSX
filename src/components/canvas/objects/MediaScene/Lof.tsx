import React, { memo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { PlainAnimator } from "three-plain-animator/lib/plain-animator";
import { useTexture } from "@react-three/drei";

const Lof = () => {
  const lofTex: any = useTexture("/sprites/media/lof_spritesheet.png");

  const [animator] = useState(() => {
    const anim = new PlainAnimator(lofTex, 8, 1, 8, 24);
    anim.init(0);
    return anim;
  });

  useFrame(() => {
    animator.animate();
  });

  return (
    <sprite position={[-2, 1.8, 0]} scale={[0.8, 0.8, 0.8]}>
      <spriteMaterial map={lofTex} />
    </sprite>
  );
};

export default memo(Lof);
