import React, { memo, useEffect, useState } from "react";
import node_positions from "../../../../resources/node_positions.json";
import { useStore } from "../../../../store";
import { SiteType } from "../Site";
import InactiveLevelNode from "./InactiveLevelNode";
import usePrevious from "../../../../hooks/usePrevious";
import { generateInactiveNodes } from "../../../../core/utils/nodeUtils";

type ActiveLevelNodesProps = {
  visibleNodes: SiteType;
};

const InactiveLevelNodes = memo((props: ActiveLevelNodesProps) => {
  const activeLevel = useStore((state) => state.activeLevel);
  const prevData = usePrevious({ activeLevel });

  const [visibleNodes, setVisibleNodes] = useState<{}>(
    generateInactiveNodes(props.visibleNodes, activeLevel)
  );

  useEffect(() => {
    if (
      prevData?.activeLevel !== activeLevel &&
      prevData?.activeLevel !== undefined
    ) {
      const prevLevel = parseInt(prevData?.activeLevel);
      const newLevel = parseInt(activeLevel);
      if (prevLevel - 1 === newLevel || prevLevel + 1 === newLevel) {
        setVisibleNodes(generateInactiveNodes(props.visibleNodes, activeLevel));
      } else {
        setTimeout(() => {
          setVisibleNodes(
            generateInactiveNodes(props.visibleNodes, activeLevel)
          );
        }, 1500);
      }
    }
  }, [activeLevel, prevData?.activeLevel, props.visibleNodes]);

  return (
    <>
      {Object.entries(visibleNodes).map((node: [string, any]) => {
        return (
          <InactiveLevelNode
            nodeName={node[1].node_name}
            position={
              node_positions[node[0].substr(2) as keyof typeof node_positions]
                .position
            }
            rotation={
              node_positions[node[0].substr(2) as keyof typeof node_positions]
                .rotation
            }
            key={node[1].node_name}
            level={node[0].substr(0, 2)}
          />
        );
      })}
    </>
  );
});

export default InactiveLevelNodes;
