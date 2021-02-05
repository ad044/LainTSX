import React, { useMemo, memo } from "react";
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

  const visibleRings = useMemo(() => {
    const rings: [string, number][] = [];
    if (props.activateAllRings) {
      Object.entries(level_y_values).forEach((levelDataPair) => {
        rings.push([levelDataPair[0], levelDataPair[1]]);
      });
    } else {
      const activeLevelNr = parseInt(activeLevel);
      const visibleLevels = [
        (activeLevelNr - 2).toString().padStart(2, "0"),
        (activeLevelNr - 1).toString().padStart(2, "0"),
        activeLevelNr.toString().padStart(2, "0"),
        (activeLevelNr + 1).toString().padStart(2, "0"),
        (activeLevelNr + 2).toString().padStart(2, "0"),
      ];

      visibleLevels.forEach((level) => {
        rings.push([
          level,
          level_y_values[level as keyof typeof level_y_values],
        ]);
      });
    }
    return rings;
  }, [props.activateAllRings, activeLevel]);

  return (
    <>
      {visibleRings.map((level: [string, number]) => {
        if (
          (currentSite === "b" && parseInt(level[0]) <= 13) ||
          currentSite === "a"
        ) {
          return (
            <group position={[0, level[1], 0]} key={level[0]}>
              <PurpleRing
                purpleRingPosY={0.44}
                level={level[0]}
                site={currentSite}
              />
              <GrayRing grayRingPosY={-0.29} />
              <CyanCrystal crystalRingPosY={-0.45} />
            </group>
          );
        }
      })}
    </>
  );
});

export default Rings;
