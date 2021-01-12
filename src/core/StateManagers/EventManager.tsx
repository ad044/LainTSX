import React, { useCallback, useEffect, useRef, useState } from "react";
import SiteManager from "./MainSceneManagers/SiteManager";
import MiddleRingManager from "./MainSceneManagers/MiddleRingManager";
import LainManager from "./MainSceneManagers/LainManager";
import NodeManager from "./MainSceneManagers/NodeManager";
import NodeHUDManager from "./MainSceneManagers/NodeHUDManager";
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
import GreenTextManager from "./MainSceneManagers/GreenTextManager";
import MediaComponentManager from "./MediaSceneManagers/MediaComponentManager";
import SceneManager from "./SceneManager";
import YellowTextManager from "./MainSceneManagers/YellowTextManager";
import LevelManager from "./MainSceneManagers/LevelManager";
import BootComponentManager from "./BootComponentManager";
import SSknComponentManager from "./SSknComponentManager";
import handleMainSceneEvent from "../mainSceneEventHandler";
import handleMediaSceneEvent from "../mediaSceneEventHandler";
import handleBootEvent from "../bootEventHandler";
import handleSSknSceneEvent from "../ssknSceneEventHandler";
import BootAuthorizeUserManager from "./BootAuthorizeUserManager";
import LevelSelectionManager from "./MainSceneManagers/LevelSelectionManager";
import SubsceneManager from "./SubsceneManager";
import PauseComponentManager from "./MainSceneManagers/PauseComponentManager";
import MediaYellowTextManager from "./MediaYellowTextManager";
import GameSaver from "./GameSaver";
import GameLoader from "./GameLoader";
import { useFrame } from "react-three-fiber";

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
    32: "SPACE",
  };
  return keyCodeAssocs[keyCode as keyof typeof keyCodeAssocs];
};

export type StateManagerProps = {
  eventState: any;
};

const EventManager = () => {
  const currentScene = useSceneStore((state) => state.currentScene);

  // main scene
  const currentSite = useSiteStore((state) => state.currentSite);
  const activeNodeId = useNodeStore((state) => state.activeNodeState.id);
  const nodeMatrixIndices = useNodeStore((state) => state.nodeMatrixIndices);
  const siteTransformState = useSiteStore((state) => state.transformState);
  const activeLevel = useLevelStore((state) => state.activeLevel);
  const mainSubscene = useMainSceneStore((state) => state.subscene);
  const selectedLevel = useLevelSelectionStore((state) => state.selectedLevel);
  const pauseMatrixIdx = usePauseStore((state) => state.componentMatrixIdx);
  const activePauseComponent = usePauseStore(
    useCallback((state) => state.componentMatrix[pauseMatrixIdx], [
      pauseMatrixIdx,
    ])
  );
  const gameProgress = useNodeStore((state) => state.gameProgress);

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

  const timePassedSinceLastKeyPress = useRef(-1);

  useFrame(() => {
    const now = Date.now();
    if (
      timePassedSinceLastKeyPress.current > -1 &&
      mainSubscene !== "pause" &&
      currentScene === "main"
    ) {
      if (now > timePassedSinceLastKeyPress.current + 10000) {
        const moves = [
          "prayer",
          "touch_sleeve",
          "thinking",
          "stretch_2",
          "stretch",
          "spin",
          "scratch_head",
          "blush",
          "hands_behind_head",
          "hands_on_hips",
          "hands_on_hips_2",
          "hands_together",
          "lean_forward",
          "lean_left",
          "lean_right",
          "look_around",
          "play_with_hair",
        ];

        const event = moves[Math.floor(Math.random() * moves.length)];
        setEventState({ event: event });
        timePassedSinceLastKeyPress.current = now - 2500;
      }
      if (now > timePassedSinceLastKeyPress.current + 5000) {
        const siteAIdleNodes = [
          "0000",
          "0001",
          "0002",
          "0003",
          "0004",
          "0005",
          "0006",
          "0007",
          "0008",
          "0009",
        ];
        // todo
        const siteBIdleNodes = ["0001"];

        const nodeToPlay =
          currentSite === "a"
            ? siteAIdleNodes[Math.floor(Math.random() * siteAIdleNodes.length)]
            : siteBIdleNodes[Math.floor(Math.random() * siteBIdleNodes.length)];

        setEventState({
          event: "play_idle_media",
          scene: "idle_media",
          idleNodeId: nodeToPlay,
        });
        timePassedSinceLastKeyPress.current = -1;
      }
    }
  });

  const handleKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      const keyPress = getKeyCodeAssociation(keyCode);

      if (keyPress && !inputCooldown) {
        timePassedSinceLastKeyPress.current = Date.now() + 2500;
        let event;
        switch (currentScene) {
          case "main":
            event = handleMainSceneEvent({
              mainSubscene: mainSubscene,
              keyPress: keyPress,
              siteTransformState: siteTransformState,
              activeNodeId: activeNodeId,
              nodeMatrixIndices: nodeMatrixIndices,
              activeLevel: activeLevel,
              selectedLevel: selectedLevel,
              pauseMatrixIdx: pauseMatrixIdx,
              activePauseComponent: activePauseComponent,
              gameProgress: gameProgress,
              currentSite: currentSite,
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
      inputCooldown,
      currentScene,
      mainSubscene,
      siteTransformState,
      activeNodeId,
      nodeMatrixIndices,
      activeLevel,
      selectedLevel,
      pauseMatrixIdx,
      activePauseComponent,
      gameProgress,
      currentSite,
      activeMediaComponent,
      wordPosStateIdx,
      rightSideComponentIdx,
      currentBootSubscene,
      activeBootElement,
      authorizeUserBgLettersPos,
      authorizeUserActiveLetterTexOffset,
      authorizeUserMatrixIdx,
      activeSSknComponent,
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
      <SceneManager eventState={eventState!} />
      <YellowTextManager eventState={eventState!} />
      <LevelManager eventState={eventState!} />
      <BootComponentManager eventState={eventState!} />
      <SSknComponentManager eventState={eventState!} />
      <BootAuthorizeUserManager eventState={eventState!} />
      <LevelSelectionManager eventState={eventState!} />
      <SubsceneManager eventState={eventState!} />
      <PauseComponentManager eventState={eventState!} />
      <MediaYellowTextManager eventState={eventState!} />
      <GameSaver eventState={eventState!} />
      <GameLoader eventState={eventState!} />
    </>
  );
};

export default EventManager;
