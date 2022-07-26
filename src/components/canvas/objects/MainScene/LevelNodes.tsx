import usePrevious from "@/hooks/usePrevious";
import { useStore } from "@/store";
import {
  FlattenedSiteLayout,
  GameSite,
  MainSubscene,
  NodeID,
  Position,
} from "@/types";
import { getLevelY } from "@/utils/site";
import React, { memo, useEffect, useState } from "react";
import Node from "./Node";

type LevelNodesProps = {
  flattenedLayout: FlattenedSiteLayout;
  site: GameSite;
};

const LevelNodes = (props: LevelNodesProps) => {
  const currentLevel = useStore((state) => state.level);
  const paused = useStore((state) => state.mainSubscene === MainSubscene.Pause);
  const currentNode = useStore((state) => state.node);
  const prevData = usePrevious({ level: currentLevel });

  const [nodes, setNodes] = useState<NodeID[]>(
    props.flattenedLayout[currentLevel]
  );
  const [pos, setPos] = useState<Position>([0, getLevelY(currentLevel), 0]);

  useEffect(() => {
    if (prevData?.level !== currentLevel && prevData?.level !== undefined) {
      if (Math.abs(prevData.level - currentLevel) === 1) {
        // if only changed one level
        setNodes(props.flattenedLayout[currentLevel]);
        setPos([0, getLevelY(currentLevel), 0]);
      } else {
        // if changed from level selection
        setTimeout(() => {
          setNodes(props.flattenedLayout[currentLevel]);
          setPos([0, getLevelY(currentLevel), 0]);
        }, 1500);
      }
    }
  }, [currentLevel, prevData?.level, props.flattenedLayout, props.site]);

  return (
    <group position={pos}>
      {nodes.map((nodeId) => (
        <Node
          id={nodeId}
          key={nodeId}
          active={nodeId === currentNode?.id && !paused}
        />
      ))}
    </group>
  );
};

export default memo(LevelNodes);
