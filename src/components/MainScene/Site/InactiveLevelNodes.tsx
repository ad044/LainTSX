import React, { useMemo } from "react";
import site_a from "../../../resources/site_a.json";
import site_b from "../../../resources/site_b.json";
import node_positions from "../../../resources/node_positions.json";
import Node from "../Node";
import { useLevelStore, useNodeStore, useSiteStore } from "../../../store";
import { isNodeVisible } from "../../../core/nodeSelector";

const InactiveLevelNodes = () => {
  const gameProgress = useNodeStore((state) => state.gameProgress);
  const currentSite = useSiteStore((state) => state.currentSite);

  const siteData = currentSite === "a" ? site_a : site_b;

  const activeLevel = useLevelStore((state) => state.activeLevel);
  const visibleNodes = useMemo(() => {
    const obj = {};
    const activeLevelNr = parseInt(activeLevel);
    const visibleLevels = [
      (activeLevelNr - 2).toString().padStart(2, "0"),
      (activeLevelNr - 1).toString().padStart(2, "0"),
      (activeLevelNr + 1).toString().padStart(2, "0"),
      (activeLevelNr + 2).toString().padStart(2, "0"),
    ];

    visibleLevels.forEach((level) => {
      Object.assign(obj, siteData[level as keyof typeof siteData]);
    });

    return obj;
  }, [activeLevel, siteData]);

  return (
    <>
      {Object.entries(visibleNodes).map((node: [string, any]) => {
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
              level={node[0].substr(0, 2)}
            />
          );
        }
      })}
    </>
  );
};

export default InactiveLevelNodes;
