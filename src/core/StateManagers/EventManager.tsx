import React, { useCallback, useEffect, useState } from "react";
import SiteManager from "./SiteManager";
import MiddleRingManager from "./MiddleRingManager";
import LainManager from "./LainManager";
import NodeManager from "./NodeManager";
import NodeHUDManager from "./NodeHUDManager";
import {
  useAuthorizeUserStore,
  useBootStore,
  useLevelSelectionStore,
  useLevelStore,
  useMainSceneStore,
  useMediaStore,
  useMediaWordStore,
  useNodeStore,
  usePauseStore,
  useSceneStore,
  useSiteStore,
  useSSknStore,
} from "../../store";
import GreenTextManager from "./GreenTextManager";
import MediaComponentManager from "./MediaComponentManager";
import MediaWordManager from "./MediaWordManager";
import SceneManager from "./SceneManager";
import YellowTextManager from "./YellowTextManager";
import LevelManager from "./LevelManager";
import BootComponentManager from "./BootComponentManager";
import SSknComponentManager from "./SSknComponentManager";
import handleMainSceneEvent from "../mainSceneEventHandler";
import handleMediaSceneEvent from "../mediaSceneEventHandler";
import handleBootEvent from "../bootEventHandler";
import handleSSknSceneEvent from "../ssknSceneEventHandler";
import BootAuthorizeUserManager from "./BootAuthorizeUserManager";
import LevelSelectionManager from "./LevelSelectionManager";
import SubsceneManager from "./SubsceneManager";
import PauseComponentManager from "./PauseComponentManager";

const getKeyCodeAssociation = (keyCode: number): string => {
  const keyCodeAssocs = {
    40: "DOWN", // down arrow
    37: "LEFT", // left arrow
    38: "UP", // up arrow
    39: "RIGHT", // right arrow
    88: "CIRCLE", // x key
    90: "X", // z key
    68: "TRIANGLE", // d key
    69: "L2", // e key
  };
  return keyCodeAssocs[keyCode as keyof typeof keyCodeAssocs];
};

export type StateManagerProps = {
  eventState: any;
};

const EventManager = () => {
  const currentScene = useSceneStore((state) => state.currentScene);

  // main scene
  const nodeMatrixIndices = useNodeStore((state) => state.nodeMatrixIndices);
  const siteTransformState = useSiteStore((state) => state.transformState);
  const activeLevel = useLevelStore((state) => state.activeLevel);
  const mainSubscene = useMainSceneStore((state) => state.subscene);
  const levelSelectionIdx = useLevelSelectionStore(
    (state) => state.selectedLevelIdx
  );
  const pauseMatrixIdx = usePauseStore((state) => state.componentMatrixIdx);
  const activePauseComponent = usePauseStore(
    useCallback((state) => state.componentMatrix[pauseMatrixIdx], [
      pauseMatrixIdx,
    ])
  );
  const unlockedNodes = useNodeStore((state) => state.unlockedNodes);

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
  const rightSideComponentIdx = useMediaStore(
    (state) => state.componentMatrixIndices.rightSideIdx
  );

  const wordPosStateIdx = useMediaWordStore((state) => state.posStateIdx);

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
        state.componentMatrix[
          currentBootSubscene as keyof typeof state.componentMatrix
        ][
          state.componentMatrixIndices[
            currentBootSubscene as keyof typeof state.componentMatrixIndices
          ]
        ],
      [currentBootSubscene]
    )
  );

  const authorizeUserBgLettersPos = useAuthorizeUserStore(
    (state) => state.bgLettersPos
  );
  const authorizeUserActiveLetterTexOffset = useAuthorizeUserStore(
    (state) => state.activeLetterTextureOffset
  );
  const authorizeUserMatrixIdx = useBootStore(
    (state) => state.componentMatrixIndices.authorize_user
  );

  const [eventState, setEventState] = useState<any>();

  const [inputCooldown, setInputCooldown] = useState(false);

  const handleKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      const keyPress = getKeyCodeAssociation(keyCode);

      if (keyPress && !inputCooldown) {
        let event;
        switch (currentScene) {
          case "main":
            event = handleMainSceneEvent({
              mainSubscene: mainSubscene,
              keyPress: keyPress,
              siteTransformState: siteTransformState,
              nodeMatrixIndices: nodeMatrixIndices,
              activeLevel: activeLevel,
              levelSelectionIdx: levelSelectionIdx,
              pauseMatrixIdx: pauseMatrixIdx,
              activePauseComponent: activePauseComponent,
              unlockedNodes: unlockedNodes,
            });
            break;
          case "media":
            event = handleMediaSceneEvent({
              keyPress: keyPress,
              activeMediaComponent: activeMediaComponent,
              wordPosStateIdx: wordPosStateIdx,
              rightSideComponentIdx: rightSideComponentIdx,
            });
            break;
          case "boot":
            event = handleBootEvent({
              keyPress: keyPress,
              bootSubscene: currentBootSubscene,
              activeBootElement: activeBootElement,
              authorizeUserBgLettersPos: authorizeUserBgLettersPos,
              authorizeUserActiveLetterTexOffset: authorizeUserActiveLetterTexOffset,
              authorizeUserMatrixIdx: authorizeUserMatrixIdx,
            });
            break;
          case "gate":
            event = { event: "exit_gate" };
            break;
          case "sskn":
            event = handleSSknSceneEvent({
              keyPress: keyPress,
              activeSSknComponent: activeSSknComponent,
            });
            break;
        }
        setEventState(event);
      }
    },
    [
      activeBootElement,
      activeLevel,
      activeMediaComponent,
      activeSSknComponent,
      authorizeUserActiveLetterTexOffset,
      authorizeUserBgLettersPos,
      authorizeUserMatrixIdx,
      currentBootSubscene,
      currentScene,
      inputCooldown,
      levelSelectionIdx,
      mainSubscene,
      nodeMatrixIndices,
      pauseMatrixIdx,
      rightSideComponentIdx,
      siteTransformState,
      wordPosStateIdx,
    ]
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
      <BootComponentManager eventState={eventState!} />
      <SSknComponentManager eventState={eventState!} />
      <BootAuthorizeUserManager eventState={eventState!} />
      <LevelSelectionManager eventState={eventState!} />
      <SubsceneManager eventState={eventState!} />
      <PauseComponentManager eventState={eventState!} />
    </>
  );
};

export default EventManager;
