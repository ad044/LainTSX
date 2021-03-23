import React from "react";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import mediaNodeNameContainer from "../../static/sprites/media/media_node_name_container.png";

const NodeNameContainer = () => {
  const mediaNodeNameContainerTex = useLoader(
    THREE.TextureLoader,
    mediaNodeNameContainer
  );

  return (
    <sprite scale={[2.6, 0.5, 1]} position={[3.425, 2.5, 0]} renderOrder={3}>
      <spriteMaterial
        attach="material"
        map={mediaNodeNameContainerTex}
        transparent={true}
        depthTest={false}
      />
    </sprite>
  );
};

export default NodeNameContainer;
