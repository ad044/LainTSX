import React, { Suspense, useEffect, useMemo } from "react";
import { a, useSpring } from "@react-spring/three";
import { useStore } from "../../../store";
import ActiveLevelNodes from "./Site/ActiveLevelNodes";
import Rings from "./Site/Rings";
import site_a from "../../../resources/site_a.json";
import site_b from "../../../resources/site_b.json";
import game_progress from "../../../resources/initial_progress.json";
import NodeAnimations from "./Site/NodeAnimations";
import InactiveLevelNodes from "./Site/InactiveLevelNodes";

export type NodeDataType = {
  id: string;
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

type SiteProps = {
  shouldIntro: boolean;
  introFinished: boolean;
};

const Site = (props: SiteProps) => {
  const siteRot = useStore((state) => state.siteRot);
  const sitePos = useStore((state) => state.sitePos);
  const siteState = useSpring({
    siteRotX: siteRot[0],
    siteRotY: siteRot[1],
    sitePosY: sitePos[1],
    config: { duration: 1200 },
  });

  const introSiteState = useSpring({
    posZ: 0,
    rotX: 0,
    from: {
      posZ: -10,
      rotX: Math.PI / 2,
    },
    config: { duration: 3400 },
  });

  return (
    <Suspense fallback={null}>
      <a.group
        rotation-x={props.shouldIntro ? introSiteState.rotX : 0}
        position-z={props.shouldIntro ? introSiteState.posZ : 0}
      >
        <a.group rotation-x={siteState.siteRotX}>
          <a.group
            rotation-y={siteState.siteRotY}
            position-y={siteState.sitePosY}
          >
            <ActiveLevelNodes />
            <InactiveLevelNodes />
            <NodeAnimations />
            <Rings
              activateAllRings={props.shouldIntro ? props.introFinished : true}
            />
          </a.group>
        </a.group>
      </a.group>
    </Suspense>
  );
};

export default Site;
