import React, { useMemo } from "react";
import Node from "./Node";
import node_positions from "../../resources/node_positions.json";
import site_a from "../../resources/site_a.json";
import { useNodeStore, useLevelStore, useSiteStore } from "../../store";
import { a, useSpring } from "@react-spring/three";
import { isNodeVisible } from "../../core/nodeSelector";
import site_b from "../../resources/site_b.json";

const ActiveLevelNodes = () => {
  const gameProgress = useNodeStore((state) => state.gameProgress);

  const currentSite = useSiteStore((state) => state.currentSite);

  const siteData = currentSite === "a" ? site_a : site_b;

  const activeNodeState = useNodeStore((state) => state.activeNodeState);
  const activeLevel = useLevelStore((state) => state.activeLevel);

  const activeLevelNodes = useMemo(
    () => siteData[activeLevel as keyof typeof siteData],
    [activeLevel, siteData]
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
        if (isNodeVisible(node[0], gameProgress, currentSite)) {
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
