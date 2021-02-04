import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { a, useSpring } from "@react-spring/three";
import { useStore } from "../../../store";
import ActiveLevelNodes from "./Site/ActiveLevelNodes";
import Rings from "./Site/Rings";
import NodeAnimations from "./Site/NodeAnimations";
import InactiveLevelNodes from "./Site/InactiveLevelNodes";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";
import site_a from "../../../resources/site_a.json";
import site_b from "../../../resources/site_b.json";
import level_y_values from "../../../resources/level_y_values.json";
import { filterInvisibleNodes } from "../../../utils/node-utils";
import usePrevious from "../../../hooks/usePrevious";

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
  matrixIndices?: {
    matrixIdx: number;
    rowIdx: number;
    colIdx: number;
  };
};

export type LevelType = {
  [key: string]: NodeDataType;
};

export type SiteType = {
  [key: string]: LevelType;
};

type SiteProps = {
  introFinished: boolean;
};

const Site = (props: SiteProps) => {
  const wordSelected = useStore((state) => state.wordSelected);

  const [rotState, setRot] = useSpring(() => ({
    x: wordSelected ? 0 : useStore.getState().siteRot[0],
    y: wordSelected
      ? useStore.getState().oldSiteRot[1]
      : useStore.getState().siteRot[1],
    config: { duration: 1200 },
  }));

  const [posState, setPos] = useSpring(() => ({
    y: wordSelected
      ? -level_y_values[
          useStore.getState().oldLevel as keyof typeof level_y_values
        ]
      : -level_y_values[
          useStore.getState().activeLevel as keyof typeof level_y_values
        ],
    delay: 1300,
    config: { duration: 1200 },
  }));

  useEffect(() => {
    useStore.subscribe(setRot, (state) => ({
      x: state.siteRot[0],
      y: state.siteRot[1],
    }));
    useStore.subscribe(setPos, (state) => ({
      y: -level_y_values[state.activeLevel as keyof typeof level_y_values],
      delay: 1300,
    }));
  }, [setPos, setRot]);

  const currentSite = useStore((state) => state.activeSite);
  const gameProgress = useStore((state) => state.gameProgress);

  const visibleNodes = useMemo(
    () =>
      filterInvisibleNodes(currentSite === "a" ? site_a : site_b, gameProgress),
    [currentSite, gameProgress]
  );

  return (
    <Suspense fallback={null}>
      <a.group rotation-x={rotState.x}>
        <a.group rotation-y={rotState.y} position-y={posState.y}>
          <ActiveLevelNodes visibleNodes={visibleNodes} />
          <InactiveLevelNodes visibleNodes={visibleNodes} />
          <Rings activateAllRings={props.introFinished} />
        </a.group>
        <NodeAnimations />
      </a.group>
    </Suspense>
  );
};

export default Site;
