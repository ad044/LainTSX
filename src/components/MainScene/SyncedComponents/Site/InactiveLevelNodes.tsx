import React, { useMemo } from "react";
import node_positions from "../../../../resources/node_positions.json";
import Node from "./Node";
import { isNodeVisible } from "../../../../core/nodeSelector";
import { NodesProps } from "../Site";

const InactiveLevelNodes = (props: NodesProps) => {
  const visibleNodes = useMemo(() => {
    const obj = {};
    const activeLevelNr = parseInt(props.activeLevel);
    const visibleLevels = [
      (activeLevelNr - 2).toString().padStart(2, "0"),
      (activeLevelNr - 1).toString().padStart(2, "0"),
      (activeLevelNr + 1).toString().padStart(2, "0"),
      (activeLevelNr + 2).toString().padStart(2, "0"),
    ];

    visibleLevels.forEach((level) => {
      Object.assign(obj, props.siteData[level as keyof typeof props.siteData]);
    });

    return obj;
  }, [props]);

  return (
    <>
      {Object.entries(visibleNodes).map((node: [string, any]) => {
        if (isNodeVisible(node[0], props.gameProgress, props.currentSite)) {
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
              level={node[0].substr(0, 2)}
            />
          );
        }
      })}
    </>
  );
};

export default InactiveLevelNodes;
