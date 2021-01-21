import React, { useEffect, useMemo } from "react";
import Node from "./Node";
import node_positions from "../../../../resources/node_positions.json";
import { useMainSceneStore } from "../../../../store";
import { isNodeVisible } from "../../../../core/nodeSelector";
import { NodesProps } from "../Site";

const ActiveLevelNodes = (props: NodesProps) => {
  const activeNodeId = useMainSceneStore((state) => state.activeNode.id);

  const activeLevelNodes = useMemo(
    () => props.siteData[props.activeLevel as keyof typeof props.siteData],
    [props]
  );

  useEffect(() => {
    console.log(activeNodeId);
  }, [activeNodeId]);

  return (
    <>
      {Object.entries(activeLevelNodes).map((node: [string, any]) => {
        if (isNodeVisible(node[1], props.gameProgress)) {
          return (
            <Node
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
              active={node[0] === activeNodeId}
              level={node[0].substr(0, 2)}
            />
          );
        }
      })}
    </>
  );
};

export default ActiveLevelNodes;
