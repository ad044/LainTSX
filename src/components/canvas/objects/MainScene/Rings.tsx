import React, { memo, useMemo } from "react";
import PurpleRing from "./PurpleRing";
import GrayRing from "./GrayRing";
import CyanCrystal from "./CyanCrystal";
import { useStore } from "@/store";
import { getLevelLimit, getLevelY } from "@/utils/site";
import range from "@/utils/range";
import { GameSite } from "@/types";

type RingsProps = {
  activateAllRings: boolean;
  site: GameSite;
};

const Rings = (props: RingsProps) => {
  const level = useStore((state) => state.level);

  const visibleLevels: number[] = useMemo(() => {
    if (props.activateAllRings) {
      return range(1, getLevelLimit(props.site) + 1);
    } else {
      const start = Math.max(0, level - 2);
      const end = Math.min(getLevelLimit(props.site) + 1, level + 2);

      return range(start, end);
    }
  }, [level, props.activateAllRings, props.site]);

  return (
    <>
      {visibleLevels.map((level: number) => (
        <group position={[0, getLevelY(level), 0]} key={level}>
          <PurpleRing level={level} site={props.site} />
          <GrayRing />
          <CyanCrystal />
        </group>
      ))}
    </>
  );
};

export default memo(Rings);
