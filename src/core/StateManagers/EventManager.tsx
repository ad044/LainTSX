import React, { useCallback, useEffect, useMemo, useState } from "react";
import SiteManager from "./SiteManager";
import MiddleRingManager from "./MiddleRingManager";
import LainManager from "./LainManager";
import BlueOrbManager from "./BlueOrbManager";
import BlueOrbHUDManager from "./BlueOrbHUDManager";
import {
  useBlueOrbStore,
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
  newBlueOrbColIdx: number;
  newBlueOrbRowIdx: number;
  newLevel: string;
  newActiveBlueOrbId: string;
  newSiteRotIdx: string;
};

export type StateManagerProps = {
  eventState: any;
};

export type GameContext = {
  keyPress?: string;
  scene: string;
  subscene: string;
  blueOrbMatrixIndices: { rowIdx: number; colIdx: number };
  currentLevel: string;
  siteRotIdx: string;
  activeMediaComponent: string;
  activeBootElement: string;
};

const EventManager = () => {
  const currentScene = useSceneStore((state) => state.currentScene);
  const currentSubscene = useSubsceneStore((state) => state.activeSubscene);

  // main scene
  const blueOrbMatrixIndices = useBlueOrbStore(
    (state) => state.blueOrbMatrixIndices
  );
  const siteRotIdx = useSiteStore((state) => state.siteRotIdx);
  const currentLevel = useLevelStore((state) => state.currentLevel);

  // media scene
  const activeMediaComponent = useMediaStore(
    (state) => state.activeMediaComponent
  );

  // boot scene
  const activeBootElement = useBootStore((state) => state.activeBootElement);

  const [eventState, setEventState] = useState<any>();

  const [inputCooldown, setInputCooldown] = useState(false);

  const gameContext: GameContext = useMemo(
    () => ({
      scene: currentScene,
      subscene: currentSubscene,
      siteRotIdx: siteRotIdx,
      blueOrbMatrixIndices: blueOrbMatrixIndices,
      currentLevel: currentLevel,
      activeMediaComponent: activeMediaComponent,
      activeBootElement: activeBootElement,
    }),
    [
      activeBootElement,
      activeMediaComponent,
      blueOrbMatrixIndices,
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
      <BlueOrbManager eventState={eventState!} />
      <BlueOrbHUDManager eventState={eventState!} />
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
