import React, { useMemo } from "react";
import level_y_values from "../../../../resources/level_y_values.json";
import PurpleRing from "./PurpleRing";
import GrayRing from "./GrayRing";
import CyanCrystal from "./CyanCrystal";

type RingsProps = {
  currentSite: string;
  activeLevel: string;
  activateAllRings: boolean;
};

const Rings = (props: RingsProps) => {
  const visibleRings = useMemo(() => {
    const rings: [string, number][] = [];
    if (props.activateAllRings) {
      Object.entries(level_y_values).forEach((levelDataPair) => {
        rings.push([levelDataPair[0], levelDataPair[1]]);
      });
    } else {
      const activeLevelNr = parseInt(props.activeLevel);
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
  }, [props.activateAllRings, props.activeLevel]);

  return (
    <>
      {visibleRings.map((level: [string, number]) => {
        if (
          (props.currentSite === "b" && parseInt(level[0]) <= 13) ||
          props.currentSite === "a"
        ) {
          return (
            <group position={[0, level[1], 0]} key={level[0]}>
              <PurpleRing
                purpleRingPosY={0.44}
                level={level[0]}
                site={props.currentSite}
              />
              <GrayRing grayRingPosY={-0.29} />
              <CyanCrystal crystalRingPosY={-0.45} />
            </group>
          );
        }
      })}
    </>
  );
};

export default Rings;
