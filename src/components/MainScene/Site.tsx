import React, { memo, Suspense, useMemo } from "react";
import site_a from "../../resources/site_a.json";
import level_y_values from "../../resources/level_y_values.json";
import node_positions from "../../resources/node_positions.json";
import Node from "./Node";
import { a, useSpring } from "@react-spring/three";
import { useLevelStore, useNodeStore, useSiteStore } from "../../store";
import PurpleRing from "./PurpleRing";
import GrayRing from "./GrayRing";
import CyanCrystal from "./CyanCrystal";

export type NodeDataType = {
  image_table_indices: { 1: string; 2: string; 3: string };
  is_hidden: string;
  media_file: string;
  node_name: string;
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
  const unlockedNodes = useNodeStore((state) => state.unlockedNodes);

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
      Object.assign(obj, site_a[level as keyof typeof site_a]);
    });

    return obj;
  }, [activeLevel]);

  const siteTransformState = useSiteStore((state) => state.transformState);

  const siteState = useSpring({
    siteRotY: siteTransformState.rotY,
    sitePosY: siteTransformState.posY,
    siteRotX: siteTransformState.rotX,
    config: { duration: 1200 },
  });

  return (
    <Suspense fallback={null}>
      <a.group
        rotation-y={siteState.siteRotY}
        position-y={siteState.sitePosY}
        rotation-x={siteState.siteRotX}
      >
        {Object.entries(level_y_values).map((level: [string, number]) => (
          <group position={[0, level[1], 0]} key={level[0]}>
            <PurpleRing purpleRingPosY={0.44} level={level[0]} />
            <GrayRing grayRingPosY={-0.29} />
            <CyanCrystal crystalRingPosY={-0.45} />
          </group>
        ))}
        {Object.entries(visibleNodes).map((node: [string, any]) => {
          const unlockedBy = node[1].unlocked_by;

          let unlocked;
          if (unlockedBy === "-1") unlocked = true;
          else
            unlocked =
              unlockedNodes[unlockedBy as keyof typeof unlockedNodes].unlocked;

          if (
            unlocked &&
            (node[1].is_hidden === "0" || node[1].is_hidden === "3")
          ) {
            return (
              <Node
                sprite={node[1].node_name}
                position={
                  node_positions[
                    node[0].substr(2) as keyof typeof node_positions
                  ].position
                }
                rotation={
                  node_positions[
                    node[0].substr(2) as keyof typeof node_positions
                  ].rotation
                }
                key={node[1].node_name}
                level={node[0].substr(0, 2)}
              />
            );
          }
        })}
      </a.group>
    </Suspense>
  );
});

export default Site;
