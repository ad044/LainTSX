import React, { memo, useState } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "react-three-fiber";
import lofSpriteSheet from "../../static/sprite/lof_spritesheet.png";
import { PlainAnimator } from "three-plain-animator/lib/plain-animator";

const Lof = memo(() => {
  const lofTex: any = useLoader(THREE.TextureLoader, lofSpriteSheet);

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
      <spriteMaterial attach="material" map={lofTex} />
    </sprite>
  );
});

export default Lof;
