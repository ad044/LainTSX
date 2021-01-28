import React, { memo, useEffect, useState } from "react";
import Node from "./Node";
import node_positions from "../../../../resources/node_positions.json";
import { useStore } from "../../../../store";
import { isNodeVisible } from "../../../../core/nodeSelector";
import site_a from "../../../../resources/site_a.json";
import site_b from "../../../../resources/site_b.json";
import { NodeDataType, SiteType } from "../Site";
import usePrevious from "../../../../hooks/usePrevious";

type ActiveLevelNodesProps = {
  visibleNodes: any;
};

const ActiveLevelNodes = memo((props: ActiveLevelNodesProps) => {
  const activeNodeId = useStore((state) => state.activeNode.id);
  const gameProgress = useStore((state) => state.gameProgress);
  const currentSite = useStore((state) => state.activeSite);
  const activeLevel = useStore((state) => state.activeLevel);
  const prevData = usePrevious({ activeLevel });

  const [visibleNodes, setVisibleNodes] = useState(
    props.visibleNodes[activeLevel]
  );

  useEffect(() => {
    const siteData = currentSite === "a" ? site_a : site_b;
    if (
      prevData?.activeLevel !== activeLevel &&
      prevData?.activeLevel !== undefined
    ) {
      const prevLevel = parseInt(prevData?.activeLevel);
      const newLevel = parseInt(activeLevel);
      if (prevLevel - 1 === newLevel || prevLevel + 1 === newLevel) {
        setVisibleNodes(siteData[activeLevel as keyof typeof siteData]);
      } else {
        setTimeout(() => {
          setVisibleNodes(siteData[activeLevel as keyof typeof siteData]);
        }, 1500);
      }
    }
  }, [activeLevel, currentSite, gameProgress, prevData?.activeLevel]);

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
