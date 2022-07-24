import React, { memo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { PlainAnimator } from "three-plain-animator/lib/plain-animator";
import { useTexture } from "@react-three/drei";

const Loading = () => {
  const loading = useTexture("/sprites/loading/loading_spritesheet.png");
  const lifeInstinct = useTexture(
    "/sprites/loading/life_instinct_function_os.png"
  );

  const [animator] = useState(() => {
    const anim = new PlainAnimator(loading, 10, 3, 29, 60);
    anim.init(0);
    return anim;
  });

  useFrame(() => {
    animator.animate();
  });

  return (
    <>
      <sprite scale={[5, 5, 5]} renderOrder={999}>
        <spriteMaterial color={0x000000} depthTest={false} />
      </sprite>
      <sprite
        scale={[0.35, 0.6, 0.35]}
        position={[0, 0.2, 0]}
        renderOrder={1000}
      >
        <spriteMaterial map={loading} depthTest={false} />
      </sprite>
      <sprite
        scale={[0.4, 0.6, 0.4]}
        position={[0, -0.5, 0]}
        renderOrder={1000}
      >
        <spriteMaterial map={lifeInstinct} depthTest={false} />
      </sprite>
    </>
  );
};

export default memo(Loading);
