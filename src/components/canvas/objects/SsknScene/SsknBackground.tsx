import React, { memo } from "react";
import { useTexture } from "@react-three/drei";

const SsknBackground = () => {
  const bg = useTexture("/sprites/sskn/sskn_background.png");
  const bgText = useTexture("/sprites/sskn/sskn_background_text.png");
  const topLabel = useTexture("/sprites/sskn/sskn_top_label.png");
  const dango = useTexture("/sprites/sskn/sskn_dango.png");

  return (
    <>
      <mesh scale={[5, 6.4, 0]} position={[-0.25, -0.5, 0]}>
        <planeBufferGeometry attach="geometry" />
        <meshBasicMaterial map={bg} transparent={true} />
      </mesh>
      <sprite scale={[4.5, 2.5, 0]} position={[2.2, 0, 0]} renderOrder={3}>
        <spriteMaterial map={bgText} transparent={true} opacity={0.5} />
      </sprite>
      <sprite position={[-3, 3, 0]} scale={[3.5, 0.4, 0]} renderOrder={4}>
        <spriteMaterial map={dango} opacity={0.5} />
      </sprite>
      <sprite position={[3.5, 3, 0]} scale={[2, 0.5, 0]}>
        <spriteMaterial map={topLabel} />
      </sprite>
    </>
  );
};

export default memo(SsknBackground);
