import React, { memo } from "react";
import { useStore } from "@/store";
import { useTexture } from "@react-three/drei";

const NotFound = () => {
  const notFound = useTexture("/sprites/main/not_found.png");
  const notFoundLof = useTexture("/sprites/main/not_found_lof.png");

  // TOOD ?
  const wordNotFound = useStore((state) => state.wordNotFound);

  return (
    <group visible={wordNotFound}>
      <sprite scale={[1, 0.25, 0]} renderOrder={106} position={[-1, -0.05, 0]}>
        <spriteMaterial map={notFoundLof} depthTest={false} />
      </sprite>

      <sprite scale={[4.1, 0.6, 0]} renderOrder={105} position={[0, -0.15, 0]}>
        <spriteMaterial map={notFound} depthTest={false} />
      </sprite>
    </group>
  );
};

export default memo(NotFound);
