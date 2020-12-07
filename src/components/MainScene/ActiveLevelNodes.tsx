import React, { useMemo } from "react";
import Node from "./Node";
import node_positions from "../../resources/node_positions.json";
import site_a from "../../resources/site_a.json";
import { useNodeStore, useLevelStore, useSiteStore } from "../../store";
import { a, useSpring } from "@react-spring/three";

const ActiveLevelNodes = () => {
  const unlockedNodes = useNodeStore((state) => state.unlockedNodes);

  const activeNodeState = useNodeStore((state) => state.activeNodeState);
  const activeLevel = useLevelStore((state) => state.activeLevel);

  const activeLevelNodes = useMemo(
    () => site_a[activeLevel as keyof typeof site_a],
    [activeLevel]
  );

  const siteTransformState = useSiteStore((state) => state.transformState);

  const siteState = useSpring({
    siteRotY: siteTransformState.rotY,
    sitePosY: siteTransformState.posY,
    siteRotX: siteTransformState.rotX,
    config: { duration: 1200 },
  });

  return (
    <a.group
      rotation-y={siteState.siteRotY}
      position-y={siteState.sitePosY}
      rotation-x={siteState.siteRotX}
    >
      {Object.entries(activeLevelNodes).map((node: [string, any]) => {
        const unlockedBy = node[1].unlocked_by;

        let unlocked;
        if (unlockedBy === "-1") unlocked = true;
        else
          unlocked =
            unlockedNodes[unlockedBy as keyof typeof unlockedNodes].unlocked;

        if (
          unlocked &&
          (node[1].is_hidden === "0" || node[1].is_hidden === "3")
        ) {
          return (
            <Node
              sprite={node[1].node_name}
              position={
                node_positions[node[0].substr(2) as keyof typeof node_positions]
                  .position
              }
              rotation={
                node_positions[node[0].substr(2) as keyof typeof node_positions]
                  .rotation
              }
              key={node[1].node_name}
              active={node[0] === activeNodeState.id}
              level={node[0].substr(0, 2)}
            />
          );
        }
      })}
    </a.group>
  );
};

export default ActiveLevelNodes;
