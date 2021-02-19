import React, { Suspense, useEffect, useMemo } from "react";
import { a, useSpring } from "@react-spring/three";
import { useStore } from "../../../store";
import ActiveLevelNodes from "./ActiveLevelNodes";
import Rings from "./Rings";
import NodeAnimations from "./NodeAnimations";
import InactiveLevelNodes from "./InactiveLevelNodes";
import site_a from "../../../resources/site_a.json";
import site_b from "../../../resources/site_b.json";
import level_y_values from "../../../resources/level_y_values.json";
import { filterInvisibleNodes } from "../../../utils/node-utils";
import Loading from "../../Loading";

export type NodeData = {
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
  words: { 1: string; 2: string; 3: string };
  matrixIndices?: {
    matrixIdx: number;
    rowIdx: number;
    colIdx: number;
  };
  is_viewed?: number;
};

export type Level = {
  [key: string]: NodeData;
};

export type SiteData = {
  [key: string]: Level;
};

type SiteProps = {
  introFinished: boolean;
};

const Site = (props: SiteProps) => {
  const wordSelected = useStore((state) => state.wordSelected);

  const [rotXState, setRotX] = useSpring(() => ({
    x: 0,
    config: { duration: 1200 },
  }));

  const [rotYState, setRotY] = useSpring(() => ({
    y: wordSelected
      ? useStore.getState().oldSiteRot[1]
      : useStore.getState().siteRot[1],
    delay: 1100,
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
    useStore.subscribe(setRotY, (state) => ({
      y: state.siteRot[1],
      delay: 1100,
    }));
    useStore.subscribe(setRotX, (state) => ({
      x: state.siteRot[0],
    }));
    useStore.subscribe(setPos, (state) => ({
      y: -level_y_values[state.activeLevel as keyof typeof level_y_values],
      delay: 1300,
    }));
  }, [setPos, setRotX, setRotY]);

  const activeSite = useStore((state) => state.activeSite);
  const gameProgress = useStore((state) => state.gameProgress);

  const visibleNodes = useMemo(
    () =>
      filterInvisibleNodes(activeSite === "a" ? site_a : site_b, gameProgress),
    [activeSite, gameProgress]
  );

  return (
    <Suspense fallback={<Loading />}>
      <a.group rotation-x={rotXState.x}>
        <a.group rotation-y={rotYState.y} position-y={posState.y}>
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
