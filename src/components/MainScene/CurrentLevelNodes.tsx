import React, { useMemo } from "react";
import Node from "./Node";
import node_positions from "../../resources/node_positions.json";
import site_a from "../../resources/site_a.json";
import { useNodeStore, useLevelStore, useSiteStore } from "../../store";
import { a, useSpring } from "@react-spring/three";

const CurrentLevelNodes = () => {
  const activeNodeId = useNodeStore((state) => state.activeNodeId);
  const currentLevel = useLevelStore((state) => state.currentLevel);

  const currentLevelNodes = useMemo(
    () => site_a[currentLevel as keyof typeof site_a],
    [currentLevel]
  );

  const siteRotY = useSiteStore((state) => state.siteRotY);
  const sitePosY = useSiteStore((state) => state.sitePosY);

  const siteState = useSpring({
    siteRotY: siteRotY,
    sitePosY: sitePosY,
    config: { duration: 1200 },
  });

  return (
    <a.group rotation-y={siteState.siteRotY} position-y={siteState.sitePosY}>
      {Object.entries(currentLevelNodes).map((node: [string, any]) => {
        return (
          <Node
            sprite={node[1].node_name}
            position={
              node_positions[
                node[0].substr(2) as keyof typeof node_positions
              ].position
            }
            rotation={
              node_positions[
                node[0].substr(2) as keyof typeof node_positions
              ].rotation
            }
            key={node[1].node_name}
            active={node[0] === activeNodeId}
            level={node[0].substr(0, 2)}
          />
        );
      })}
    </a.group>
  );
};

export default CurrentLevelNodes;
