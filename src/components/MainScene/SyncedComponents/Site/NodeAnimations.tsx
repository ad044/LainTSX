import React from "react";
import { useMainSceneStore } from "../../../../store";
import NodeExplosion from "./NodeAnimations/NodeExplosion";
import NodeRip from "./NodeAnimations/NodeRip";

const NodeAnimations = () => {
  const nodeShrinking = useMainSceneStore(
    (state) => state.activeNodeState.shrinking
  );

  const nodeExploding = useMainSceneStore(
    (state) => state.activeNodeState.exploding
  );

  return (
    <>
      {nodeExploding && <NodeExplosion />}
      {nodeShrinking && <NodeRip />}
    </>
  );
};

export default NodeAnimations;
