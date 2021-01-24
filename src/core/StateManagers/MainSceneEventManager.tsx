import React, { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "../../store";
import handleMainSceneEvent from "../mainSceneEventHandler";
import { getKeyCodeAssociation } from "../utils/keyPressUtils";
import NodeManager from "./MainSceneManagers/NodeManager";
import NodeHUDManager from "./MainSceneManagers/NodeHUDManager";
import SiteManager from "./MainSceneManagers/SiteManager";
import LainManager from "./MainSceneManagers/LainManager";
import MiddleRingManager from "./MainSceneManagers/MiddleRingManager";
import SceneManager from "./GameManagers/SceneManager";
import BigTextManager from "./MainSceneManagers/BigTextManager";
import LevelManager from "./MainSceneManagers/LevelManager";
import LevelSelectionManager from "./MainSceneManagers/LevelSelectionManager";
import SubsceneManager from "./GameManagers/SubsceneManager";
import PauseComponentManager from "./MainSceneManagers/PauseComponentManager";
import GameSaver from "./GameManagers/GameSaver";
import GameLoader from "./GameManagers/GameLoader";
import IdleManager from "./MainSceneManagers/IdleManager";
import { useFrame } from "react-three-fiber";

type MainSceneEventManagerProps = {
  loaded: boolean;
};

const MainSceneEventManager = (props: MainSceneEventManagerProps) => {
  // all the possible context needed to calculate new state
  const currentSite = useStore((state) => state.activeSite);
  const activeNodeId = useStore((state) => state.activeNode.id);
  const nodeMatrixIndices = useStore(
    (state) => state.activeNodeMatrixIndices
  );
  const siteRotY = useStore((state) => state.siteRot[1]);
  const sitePosY = useStore((state) => state.sitePos[1]);
  const activeLevel = useStore((state) => state.activeLevel);
  const mainSubscene = useStore((state) => state.mainSubscene);
  const selectedLevel = useStore((state) => state.selectedLevel);
  const pauseMatrixIdx = useStore(
    (state) => state.pauseComponentMatrixIdx
  );
  const activePauseComponent = useStore(
    useCallback((state) => state.pauseComponentMatrix[pauseMatrixIdx], [
      pauseMatrixIdx,
    ])
  );
  const gameProgress = useStore((state) => state.gameProgress);

  const timePassedSinceLastKeyPress = useRef(-1);

  const [eventState, setEventState] = useState<any>();

  useFrame(() => {
    const now = Date.now();
    if (
      timePassedSinceLastKeyPress.current > -1 &&
      mainSubscene !== "pause" &&
      mainSubscene !== "level_selection"
    ) {
      if (now > timePassedSinceLastKeyPress.current + 5000) {
        // setEventState({
        //   event: "play_idle_media",
        //   scene: "idle_media",
        //   site: currentSite,
        // });
        // timePassedSinceLastKeyPress.current = -1;
      } else if (now > timePassedSinceLastKeyPress.current + 10000) {
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
    }
  });

  const handleKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      const keyPress = getKeyCodeAssociation(keyCode);

      if (keyPress && props.loaded) {
        timePassedSinceLastKeyPress.current = Date.now() + 2500;
        const event = handleMainSceneEvent({
          mainSubscene: mainSubscene,
          keyPress: keyPress,
          sitePosY: sitePosY,
          siteRotY: siteRotY,
          activeNodeId: activeNodeId,
          nodeMatrixIndices: nodeMatrixIndices,
          activeLevel: activeLevel,
          selectedLevel: selectedLevel,
          pauseMatrixIdx: pauseMatrixIdx,
          activePauseComponent: activePauseComponent,
          gameProgress: gameProgress,
          currentSite: currentSite,
        });

        setEventState(event);
      }
    },
    [
      props.loaded,
      mainSubscene,
      sitePosY,
      siteRotY,
      activeNodeId,
      nodeMatrixIndices,
      activeLevel,
      selectedLevel,
      pauseMatrixIdx,
      activePauseComponent,
      gameProgress,
      currentSite,
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
      <SiteManager eventState={eventState!} />
      <LainManager eventState={eventState!} />
      <MiddleRingManager eventState={eventState!} />
      <SceneManager eventState={eventState!} />
      <BigTextManager eventState={eventState!} />
      <LevelManager eventState={eventState!} />
      <LevelSelectionManager eventState={eventState!} />
      <SubsceneManager eventState={eventState!} />
      <PauseComponentManager eventState={eventState!} />
      <GameSaver eventState={eventState!} />
      <GameLoader eventState={eventState!} />
      <IdleManager eventState={eventState!} />
    </>
  );
};

export default MainSceneEventManager;
