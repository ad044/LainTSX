import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  useLevelSelectionStore,
  useLevelStore,
  useMainSceneStore,
  useNodeStore,
  usePauseStore,
  useSiteStore,
} from "../../store";
import handleMainSceneEvent from "../mainSceneEventHandler";
import { getKeyCodeAssociation } from "../utils/keyPressUtils";
import NodeManager from "./MainSceneManagers/NodeManager";
import NodeHUDManager from "./MainSceneManagers/NodeHUDManager";
import SiteManager from "./MainSceneManagers/SiteManager";
import LainManager from "./MainSceneManagers/LainManager";
import MiddleRingManager from "./MainSceneManagers/MiddleRingManager";
import SceneManager from "./GameManagers/SceneManager";
import YellowTextManager from "./MainSceneManagers/YellowTextManager";
import LevelManager from "./MainSceneManagers/LevelManager";
import LevelSelectionManager from "./MainSceneManagers/LevelSelectionManager";
import SubsceneManager from "./GameManagers/SubsceneManager";
import PauseComponentManager from "./MainSceneManagers/PauseComponentManager";
import GameSaver from "./GameManagers/GameSaver";
import GameLoader from "./GameManagers/GameLoader";
import IdleManager from "./MainSceneManagers/IdleManager";

type MainSceneEventManagerProps = {
  loaded: boolean;
};

const MainSceneEventManager = (props: MainSceneEventManagerProps) => {
  // all the possible context needed to calculate new state
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

  const timePassedSinceLastKeyPress = useRef(-1);

  const [eventState, setEventState] = useState<any>();

  const handleKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      const keyPress = getKeyCodeAssociation(keyCode);

      if (keyPress && props.loaded) {
        timePassedSinceLastKeyPress.current = Date.now() + 2500;
        const event = handleMainSceneEvent({
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
        setEventState(event);
      }
    },
    [
      props.loaded,
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
      <YellowTextManager eventState={eventState!} />
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
