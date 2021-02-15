import React, { memo, useMemo } from "react";
import level_y_values from "../../../resources/level_y_values.json";
import PurpleRing from "./PurpleRing";
import GrayRing from "./GrayRing";
import CyanCrystal from "./CyanCrystal";
import { useStore } from "../../../store";

type RingsProps = {
  activateAllRings: boolean;
};

const Rings = memo((props: RingsProps) => {
  const activeLevel = useStore((state) => state.activeLevel);

  const currentSite = useStore((state) => state.activeSite);

  const levelUpperLimit = useMemo(() => (currentSite === "a" ? 22 : 13), [
    currentSite,
  ]);

  const possibleLevels = useMemo(
    () =>
      Array.from({ length: levelUpperLimit }, (_, i) =>
        (i + 1).toString().padStart(2, "0")
      ),
    [levelUpperLimit]
  );

  const visibleRings: [string, number][] = useMemo(() => {
    if (props.activateAllRings) {
      return Object.entries(level_y_values)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(0, levelUpperLimit);
    } else {
      const activeLevelIdx = parseInt(activeLevel) - 1;

      return possibleLevels
        .slice(
          activeLevelIdx < 3 ? 0 : activeLevelIdx - 3,
          activeLevelIdx > levelUpperLimit - 3
            ? levelUpperLimit
            : activeLevelIdx + 3
        )
        .map((level) => [
          level,
          level_y_values[level as keyof typeof level_y_values],
        ]);
    }
  }, [props.activateAllRings, activeLevel, possibleLevels, levelUpperLimit]);

  return (
    <>
      {visibleRings.map((level: [string, number]) => (
        <group position={[0, level[1], 0]} key={level[0]}>
          <PurpleRing
            purpleRingPosY={0.44}
            level={level[0]}
            site={currentSite}
          />
          <GrayRing grayRingPosY={-0.29} />
          <CyanCrystal crystalRingPosY={-0.45} />
        </group>
      ))}
    </>
  );
});

export default Rings;
