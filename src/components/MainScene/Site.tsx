import React, { memo, Suspense, useEffect, useState } from "react";
import { a, useSpring } from "@react-spring/three";
import { useSiteStore } from "../../store";
import ActiveLevelNodes from "./Site/ActiveLevelNodes";
import InactiveLevelNodes from "./Site/InactiveLevelNodes";
import Rings from "./Site/Rings";

export type NodeDataType = {
  image_table_indices: { 1: string; 2: string; 3: string };
  triggers_final_video: number;
  required_final_video_viewcount: number;
  media_file: string;
  node_name: string;
  site: string;
  type: number;
  title: string;
  unlocked_by: string;
  upgrade_requirement: number;
  protocol_lines: { 1: string; 2: string; 3: string; 4: string };
  words: { 1: string; 2: string; 3: string };
};

export type LevelType = {
  [key: string]: NodeDataType;
};

export type SiteType = {
  [key: string]: LevelType;
};

const Site = () => {
  const siteTransformState = useSiteStore((state) => state.transformState);

  const siteState = useSpring({
    siteRotY: siteTransformState.rotY,
    sitePosY: siteTransformState.posY,
    siteRotX: siteTransformState.rotX,
    config: { duration: 1200 },
  });

  const introSiteState = useSpring({
    posZ: 0,
    rotX: 0,
    from: { posZ: -7, rotX: Math.PI / 2 },
    config: { duration: 3900 },
  });

  return (
    <Suspense fallback={null}>
      <a.group
        rotation-x={introSiteState.rotX}
        position-z={introSiteState.posZ}
      >
        <a.group rotation-x={siteState.siteRotX}>
          <a.group
            rotation-y={siteState.siteRotY}
            position-y={siteState.sitePosY}
          >
            {/*<ActiveLevelNodes />*/}
            {/*<InactiveLevelNodes />*/}
            <Rings />
          </a.group>
        </a.group>
      </a.group>
    </Suspense>
  );
};

export default Site;
