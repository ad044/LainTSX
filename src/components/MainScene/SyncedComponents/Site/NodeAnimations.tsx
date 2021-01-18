import React from "react";
import { useNodeStore } from "../../../../store";
import NodeExplosion from "./NodeAnimations/NodeExplosion";
import NodeRip from "./NodeAnimations/NodeRip";

const NodeAnimations = () => {
  const nodeShrinking = useNodeStore(
    (state) => state.activeNodeState.shrinking
  );

  const nodeExploding = useNodeStore(
    (state) => state.activeNodeState.exploding
  );

  return (
    <>
      {nodeExploding ? <NodeExplosion /> : <></>}
      {nodeShrinking ? <NodeRip /> : <></>}
    </>
  );
};

export default NodeAnimations;
