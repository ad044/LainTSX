import React, { Suspense, useMemo } from "react";
import { a, useSpring } from "@react-spring/three";
import {
  useLevelStore,
  useMainSceneStore,
  useNodeStore,
  useSiteStore,
} from "../../../store";
import ActiveLevelNodes from "./Site/ActiveLevelNodes";
import InactiveLevelNodes from "./Site/InactiveLevelNodes";
import Rings from "./Site/Rings";
import site_a from "../../../resources/site_a.json";
import site_b from "../../../resources/site_b.json";
import game_progress from "../../../resources/initial_progress.json";

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

export type NodesProps = {
  currentSite: "a" | "b";
  activeLevel: string;
  siteData: typeof site_a | typeof site_b;
  gameProgress: typeof game_progress;
};

type SiteProps = {
  shouldIntro: boolean;
  introFinished: boolean;
};

const Site = (props: SiteProps) => {
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
    from: {
      posZ: props.shouldIntro ? -10 : 0,
      rotX: props.shouldIntro ? Math.PI / 2 : 0,
    },
    config: { duration: 3400 },
  });

  const gameProgress = useNodeStore((state) => state.gameProgress);

  const currentSite = useSiteStore((state) => state.currentSite);

  const siteData = useMemo(() => (currentSite === "a" ? site_a : site_b), [
    currentSite,
  ]);

  const activeLevel = useLevelStore((state) => state.activeLevel);

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
            <ActiveLevelNodes
              currentSite={currentSite}
              activeLevel={activeLevel}
              siteData={siteData}
              gameProgress={gameProgress}
            />
            <InactiveLevelNodes
              currentSite={currentSite}
              activeLevel={activeLevel}
              siteData={siteData}
              gameProgress={gameProgress}
            />
            <Rings
              currentSite={currentSite}
              activeLevel={activeLevel}
              activateAllRings={props.shouldIntro ? props.introFinished : true}
            />
          </a.group>
        </a.group>
      </a.group>
    </Suspense>
  );
};

export default Site;
