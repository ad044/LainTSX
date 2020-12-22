import React from "react";
import level_y_values from "../../../resources/level_y_values.json";
import { useSiteStore } from "../../../store";
import PurpleRing from "../PurpleRing";
import GrayRing from "../GrayRing";
import CyanCrystal from "../CyanCrystal";

const Rings = () => {
  const currentSite = useSiteStore((state) => state.currentSite);

  return (
    <>
      {Object.entries(level_y_values).map((level: [string, number]) => {
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
};

export default Rings;
