import React from "react";
import { useTexture } from "@react-three/drei";

const NodeNameContainer = () => {
  const container = useTexture("/sprites/media/media_node_name_container.png");

  return (
    <sprite scale={[2.6, 0.5, 1]} position={[3.425, 2.5, 0]} renderOrder={3}>
      <spriteMaterial map={container} transparent={true} depthTest={false} />
    </sprite>
  );
};

export default NodeNameContainer;
