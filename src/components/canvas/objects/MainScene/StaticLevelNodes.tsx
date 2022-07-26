import usePrevious from "@/hooks/usePrevious";
import { useStore } from "@/store";
import { FlattenedSiteLayout, GameSite } from "@/types";
import range from "@/utils/range";
import { getLevelLimit, getLevelY } from "@/utils/site";
import React, { memo, useEffect, useState } from "react";
import StaticNode from "./StaticNode";

type StaticLevelNodesProps = {
  flattenedLayout: FlattenedSiteLayout;
  site: GameSite;
};

const StaticLevelNodes = (props: StaticLevelNodesProps) => {
  const currentLevel = useStore((state) => state.level);
  const prevData = usePrevious({ level: currentLevel });

  const [visibleLevels, setVisibleLevels] = useState<number[]>(
    range(
      Math.max(currentLevel - 3, 0),
      Math.min(currentLevel + 3, getLevelLimit(props.site))
    )
  );

  useEffect(() => {
    if (prevData?.level !== currentLevel && prevData?.level !== undefined) {
      const start = Math.max(currentLevel - 3, 1);
      const end = Math.min(currentLevel + 3, getLevelLimit(props.site));
      if (Math.abs(prevData.level - currentLevel) === 1) {
        // if only changed one level
        setVisibleLevels(range(start, end));
      } else {
        // if changed from level selection
        setTimeout(() => setVisibleLevels(range(start, end)), 1500);
      }
    }
  }, [currentLevel, prevData?.level, props.site]);

  return (
    <>
      {visibleLevels.map((level) => (
        <group position={[0, getLevelY(level), 0]} key={level}>
          {props.flattenedLayout[level].map((nodeId) => (
            <StaticNode id={nodeId} key={nodeId} />
          ))}
        </group>
      ))}
    </>
  );
};

export default memo(StaticLevelNodes);
