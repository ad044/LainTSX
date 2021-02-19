import React, { memo, useEffect, useState } from "react";
import Node from "./Node";
import node_positions from "../../../resources/node_positions.json";
import { useStore } from "../../../store";
import { NodeData, SiteData } from "./Site";
import usePrevious from "../../../hooks/usePrevious";

type ActiveLevelNodesProps = {
  visibleNodes: SiteData;
};

const ActiveLevelNodes = memo((props: ActiveLevelNodesProps) => {
  const activeNodeId = useStore((state) => state.activeNode.id);
  const activeLevel = useStore((state) => state.activeLevel);
  const prevData = usePrevious({ activeLevel });

  const [visibleNodes, setVisibleNodes] = useState(
    props.visibleNodes[activeLevel]
  );

  useEffect(() => {
    if (
      prevData?.activeLevel !== activeLevel &&
      prevData?.activeLevel !== undefined
    ) {
      const prevLevel = parseInt(prevData?.activeLevel);
      const newLevel = parseInt(activeLevel);
      if (prevLevel - 1 === newLevel || prevLevel + 1 === newLevel) {
        setVisibleNodes(
          props.visibleNodes[activeLevel as keyof typeof props.visibleNodes]
        );
      } else {
        setTimeout(
          () =>
            setVisibleNodes(
              props.visibleNodes[activeLevel as keyof typeof props.visibleNodes]
            ),
          1500
        );
      }
    }
  }, [activeLevel, prevData?.activeLevel, props, props.visibleNodes]);

  return (
    <>
      {Object.values(visibleNodes).map((node: NodeData) => {
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
            viewed={Boolean(node.is_viewed)}
          />
        );
      })}
    </>
  );
});

export default ActiveLevelNodes;
