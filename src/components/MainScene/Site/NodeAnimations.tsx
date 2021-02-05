import React from "react";
import { useStore } from "../../../store";
import NodeExplosion from "./NodeAnimations/NodeExplosion";
import NodeRip from "./NodeAnimations/NodeRip";

const NodeAnimations = () => {
  const nodeShrinking = useStore(
    (state) => state.activeNodeState.shrinking
  );

  const nodeExploding = useStore(
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
