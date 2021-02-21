import React, { memo, useState } from "react";
import loadingSpritesheet from "../static/sprite/loading_spritesheet.png";
import lifeInstinct from "../static/sprite/life_instinct_function_os.png";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { PlainAnimator } from "three-plain-animator/lib/plain-animator";

const Loading = memo(() => {
  const loadingTex: any = useLoader(THREE.TextureLoader, loadingSpritesheet);
  const lifeInstinctTex = useLoader(THREE.TextureLoader, lifeInstinct);

  const [animator] = useState(() => {
    const anim = new PlainAnimator(loadingTex, 10, 3, 29, 60);
    anim.init(0);
    return anim;
  });

  useFrame(() => {
    animator.animate();
  });

  return (
    <>
      <sprite scale={[5, 5, 5]}>
        <spriteMaterial attach="material" color={0x000000} />
      </sprite>
      <sprite scale={[0.35, 0.6, 0.35]} position={[0, 0.2, 0]}>
        <spriteMaterial attach="material" map={loadingTex} />
      </sprite>
      <sprite scale={[0.4, 0.6, 0.4]} position={[0, -0.5, 0]}>
        <spriteMaterial attach="material" map={lifeInstinctTex} />
      </sprite>
    </>
  );
});

export default Loading;
