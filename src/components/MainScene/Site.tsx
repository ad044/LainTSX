import React, { memo, Suspense, useMemo } from "react";
import site_a from "../../resources/site_a.json";
import level_y_values from "../../resources/level_y_values.json";
import blue_orb_positions from "../../resources/blue_orb_positions.json";
import BlueOrb from "./BlueOrb";
import { a, useSpring } from "@react-spring/three";
import { useLevelStore, useSiteStore } from "../../store";
import PurpleRing from "./PurpleRing";
import GrayRing from "./GrayRing";
import CyanCrystal from "./CyanCrystal";

export type NodeDataType = {
  SLPS_016_0x_offset: string;
  image_table_indices: { 1: string; 2: string; 3: string };
  is_hidden: string;
  media_file: string;
  node_name: string;
  protocol_lines: {
    1: string;
    2: string;
    3: string;
  };
  site: string;
  type: string;
  title: string;
  unlocked_by: string;
  upgrade_requirement: string;
  words: { 1: string; 2: string; 3: string };
};

export type LevelType = {
  [key: string]: NodeDataType;
};

export type SiteType = {
  [key: string]: LevelType;
};

const Site = memo(() => {
  const activeLevels = useLevelStore((state) => state.activeLevels);
  const visibleNodes = useMemo(() => {
    const obj = {};
    activeLevels.forEach((level) => {
      Object.assign(obj, site_a[level as keyof typeof site_a]);
    });

    return obj;
  }, [activeLevels]);

  const siteRotY = useSiteStore((state) => state.siteRotY);
  const sitePosY = useSiteStore((state) => state.sitePosY);

  const siteState = useSpring({
    siteRotY: siteRotY,
    sitePosY: sitePosY,
    config: { duration: 1200 },
  });

  return (
    <Suspense fallback={null}>
      <a.group rotation-y={siteState.siteRotY} position-y={siteState.sitePosY}>
        {Object.entries(level_y_values).map((level: [string, number]) => (
          <group position={[0, level[1], 0]} key={level[0]}>
            <PurpleRing purpleRingPosY={0.44} level={level[0]} />
            <GrayRing grayRingPosY={-0.29} />
            <CyanCrystal crystalRingPosY={-0.45} />
          </group>
        ))}
        {Object.entries(visibleNodes).map((blueOrb: [string, any]) => (
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
            level={blueOrb[0].substr(0, 2)}
          />
        ))}
        )
      </a.group>
    </Suspense>
  );
});

export default Site;
