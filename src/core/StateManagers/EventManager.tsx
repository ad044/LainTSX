import React, { useCallback, useEffect, useMemo, useState } from "react";
import SiteManager from "./SiteManager";
import MiddleRingManager from "./MiddleRingManager";
import LainManager from "./LainManager";
import NodeManager from "./NodeManager";
import NodeHUDManager from "./NodeHUDManager";
import {
  useNodeStore,
  useBootStore,
  useLevelStore,
  useMediaStore,
  useSceneStore,
  useSiteStore,
  useSubsceneStore,
} from "../../store";
import GreenTextManager from "./GreenTextManager";
import MediaComponentManager from "./MediaComponentManager";
import MediaWordManager from "./MediaWordManager";
import MediaElementManager from "./MediaElementManager";
import SceneManager from "./SceneManager";
import YellowTextManager from "./YellowTextManager";
import MediaImageManager from "./MediaImageManager";
import computeAction from "../computeAction";
import LevelManager from "./LevelManager";
import BootManager from "./BootManager";
import SubSceneManager from "./SubSceneManager";

const getKeyCodeAssociation = (keyCode: number): string => {
  const keyCodeAssocs = {
    40: "down", // down arrow
    37: "left", // left arrow
    38: "up", // up arrow
    39: "right", // right arrow
    88: "select", // x key
    90: "back", // z key
  };
  return keyCodeAssocs[keyCode as keyof typeof keyCodeAssocs];
};

type EventState = {
  event: string;
  newNodeColIdx: number;
  newNodeRowIdx: number;
  newLevel: string;
  newActiveNodeId: string;
  newSiteRotIdx: string;
};

export type StateManagerProps = {
  eventState: any;
};

export type GameContext = {
  keyPress?: string;
  scene: string;
  subscene: string;
  nodeMatrixIndices: { rowIdx: number; colIdx: number };
  currentLevel: string;
  siteRotIdx: string;
  activeMediaComponent: string;
  activeBootElement: string;
};

const EventManager = () => {
  const currentScene = useSceneStore((state) => state.currentScene);
  const currentSubscene = useSubsceneStore((state) => state.activeSubscene);

  // main scene
  const nodeMatrixIndices = useNodeStore((state) => state.nodeMatrixIndices);
  const siteRotIdx = useSiteStore((state) => state.siteRotIdx);
  const currentLevel = useLevelStore((state) => state.currentLevel);

  // media scene
  const mediaComponentMatrixIndices = useMediaStore(
    (state) => state.componentMatrixIndices
  );

  const activeMediaComponent = useMediaStore(
    useCallback(
      (state) =>
        state.componentMatrix[mediaComponentMatrixIndices.sideIdx][
          mediaComponentMatrixIndices.sideIdx === 0
            ? mediaComponentMatrixIndices.leftSideIdx
            : mediaComponentMatrixIndices.rightSideIdx
        ],
      [mediaComponentMatrixIndices]
    )
  );

  console.log(activeMediaComponent)

  // boot scene
  const activeBootElement = useBootStore((state) => state.activeBootElement);

  const [eventState, setEventState] = useState<any>();

  const [inputCooldown, setInputCooldown] = useState(false);

  const gameContext: GameContext = useMemo(
    () => ({
      scene: currentScene,
      subscene: currentSubscene,
      siteRotIdx: siteRotIdx,
      nodeMatrixIndices: nodeMatrixIndices,
      currentLevel: currentLevel,
      activeMediaComponent: activeMediaComponent,
      activeBootElement: activeBootElement,
    }),
    [
      activeBootElement,
      activeMediaComponent,
      nodeMatrixIndices,
      currentLevel,
      currentScene,
      currentSubscene,
      siteRotIdx,
    ]
  );

  const handleKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      const keyPress = getKeyCodeAssociation(keyCode);

      if (keyPress && !inputCooldown) {
        gameContext.keyPress = keyPress;
        const event = computeAction(gameContext);
        setEventState(event);
      }
    },
    [gameContext, inputCooldown]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <>
      <NodeManager eventState={eventState!} />
      <NodeHUDManager eventState={eventState!} />
      <GreenTextManager eventState={eventState!} />
      <SiteManager eventState={eventState!} />
      <LainManager eventState={eventState!} />
      <MiddleRingManager eventState={eventState!} />
      <MediaComponentManager eventState={eventState!} />
      <MediaWordManager eventState={eventState!} />
      <MediaElementManager eventState={eventState!} />
      <SceneManager eventState={eventState!} />
      <YellowTextManager eventState={eventState!} />
      <MediaImageManager eventState={eventState!} />
      <LevelManager eventState={eventState!} />
      <BootManager eventState={eventState!} />
      <SubSceneManager eventState={eventState!} />
    </>
  );
};

export default EventManager;
