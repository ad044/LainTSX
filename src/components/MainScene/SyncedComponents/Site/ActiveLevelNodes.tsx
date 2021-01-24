import React, { useMemo, memo } from "react";
import Node from "./Node";
import node_positions from "../../../../resources/node_positions.json";
import { useStore } from "../../../../store";
import { isNodeVisible } from "../../../../core/nodeSelector";
import site_a from "../../../../resources/site_a.json";
import site_b from "../../../../resources/site_b.json";
import { NodeDataType } from "../Site";

const ActiveLevelNodes = memo(() => {
  const activeNodeId = useStore((state) => state.activeNode.id);

  const gameProgress = useStore((state) => state.gameProgress);

  const currentSite = useStore((state) => state.activeSite);

  const siteData = useMemo(() => (currentSite === "a" ? site_a : site_b), [
    currentSite,
  ]);

  const activeLevel = useStore((state) => state.activeLevel);

  const visibleNodes = useMemo(
    () => siteData[activeLevel as keyof typeof siteData],
    [activeLevel, siteData]
  );

  return (
    <>
      {Object.values(visibleNodes).map((node: NodeDataType) => {
        if (isNodeVisible(node, gameProgress)) {
          return (
            <Node
              nodeName={node.node_name}
              position={
                node_positions[node.id.substr(2) as keyof typeof node_positions]
                  .position
              }
              rotation={
                node_positions[node.id.substr(2) as keyof typeof node_positions]
                  .rotation
              }
              key={node.node_name}
              active={node.id === activeNodeId}
              level={node.id.substr(0, 2)}
            />
          );
        }
      })}
    </>
  );
});

export default ActiveLevelNodes;
