import React, { useMemo } from "react";
import BlueOrb from "./BlueOrb";
import blue_orb_positions from "../../resources/blue_orb_positions.json";
import site_a from "../../resources/site_a.json";
import { useBlueOrbStore, useLevelStore, useSiteStore } from "../../store";
import { a, useSpring } from "@react-spring/three";

const CurrentLevelNodes = () => {
  const activeBlueOrbId = useBlueOrbStore((state) => state.activeBlueOrbId);
  const currentLevel = useLevelStore((state) => state.currentLevel);

  const currentLevelNodes = useMemo(
    () => site_a[currentLevel as keyof typeof site_a],
    [currentLevel]
  );

  const siteRotY = useSiteStore((state) => state.siteRotY);
  const sitePosY = useSiteStore((state) => state.sitePosY);

  const siteState = useSpring({
    siteRotY: siteRotY,
    sitePosY: sitePosY,
    config: { duration: 1200 },
  });

  return (
    <a.group rotation-y={siteState.siteRotY} position-y={siteState.sitePosY}>
      {Object.entries(currentLevelNodes).map((blueOrb: [string, any]) => {
        return (
          <BlueOrb
            sprite={blueOrb[1].node_name}
            position={
              blue_orb_positions[
                blueOrb[0].substr(2) as keyof typeof blue_orb_positions
              ].position
            }
            rotation={
              blue_orb_positions[
                blueOrb[0].substr(2) as keyof typeof blue_orb_positions
              ].rotation
            }
            key={blueOrb[1].node_name}
            active={blueOrb[0] === activeBlueOrbId}
            level={blueOrb[0].substr(0, 2)}
          />
        );
      })}
    </a.group>
  );
};

export default CurrentLevelNodes;
