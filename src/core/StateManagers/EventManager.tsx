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
  useSSknStore,
} from "../../store";
import GreenTextManager from "./GreenTextManager";
import MediaComponentManager from "./MediaComponentManager";
import MediaWordManager from "./MediaWordManager";
import SceneManager from "./SceneManager";
import YellowTextManager from "./YellowTextManager";
import computeAction from "../computeAction";
import LevelManager from "./LevelManager";
import BootManager from "./BootManager";
import SSknComponentManager from "./SSknComponentManager";

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
  bootSubscene: string;
  nodeMatrixIndices: {
    matrixIdx: number;
    rowIdx: number;
    colIdx: number;
  };
  activeLevel: string;
  siteRotY: number;
  sitePosY: number;
  activeMediaComponent: string;
  activeBootElement: string;
  activeSSknComponent: string;
};

const EventManager = () => {
  const currentScene = useSceneStore((state) => state.currentScene);

  // main scene
  const nodeMatrixIndices = useNodeStore((state) => state.nodeMatrixIndices);
  const sitePosY = useSiteStore((state) => state.sitePosY);
  const siteRotY = useSiteStore((state) => state.siteRotY);
  const activeLevel = useLevelStore((state) => state.activeLevel);

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

  // sskn scene
  const ssknComponentMatrixIdx = useSSknStore(
    (state) => state.componentMatrixIdx
  );
  const activeSSknComponent = useSSknStore(
    useCallback((state) => state.componentMatrix[ssknComponentMatrixIdx], [
      ssknComponentMatrixIdx,
    ])
  );

  // boot scene
  const currentBootSubscene = useBootStore((state) => state.subscene);
  const activeBootElement = useBootStore(
    useCallback(
      (state) =>
        state.componentMatrix[currentBootSubscene][
          state.componentMatrixIndices[currentBootSubscene]
        ],
      [currentBootSubscene]
    )
  );

  const [eventState, setEventState] = useState<any>();

  const [inputCooldown, setInputCooldown] = useState(false);

  const gameContext: GameContext = useMemo(
    () => ({
      scene: currentScene,
      bootSubscene: currentBootSubscene,
      siteRotY: siteRotY,
      sitePosY: sitePosY,
      nodeMatrixIndices: nodeMatrixIndices,
      activeLevel: activeLevel,
      activeMediaComponent: activeMediaComponent,
      activeBootElement: activeBootElement,
      activeSSknComponent: activeSSknComponent,
    }),
    [
      currentScene,
      currentBootSubscene,
      siteRotY,
      sitePosY,
      nodeMatrixIndices,
      activeLevel,
      activeMediaComponent,
      activeBootElement,
      activeSSknComponent,
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
      <SceneManager eventState={eventState!} />
      <YellowTextManager eventState={eventState!} />
      <LevelManager eventState={eventState!} />
      <BootManager eventState={eventState!} />
      <SSknComponentManager eventState={eventState!} />
    </>
  );
};

export default EventManager;
