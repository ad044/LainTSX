import React, { useCallback, useEffect, useState } from "react";
import SiteManager from "./SiteManager";
import MiddleRingManager from "./MiddleRingManager";
import LainManager from "./LainManager";
import NodeManager from "./NodeManager";
import NodeHUDManager from "./NodeHUDManager";
import {
  useBootStore,
  useLevelStore,
  useMediaStore,
  useMediaWordStore,
  useNodeStore,
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
import BootManager from "./BootManager";
import SSknComponentManager from "./SSknComponentManager";
import handleMainSceneEvent from "../mainSceneEventHandler";
import handleMediaSceneEvent from "../mediaSceneEventHandler";
import handleBootEvent from "../bootEventHandler";
import handleSSknSceneEvent from "../ssknSceneEventHandler";

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

export type StateManagerProps = {
  eventState: any;
};

const EventManager = () => {
  const currentScene = useSceneStore((state) => state.currentScene);

  // main scene
  const nodeMatrixIndices = useNodeStore((state) => state.nodeMatrixIndices);
  const siteTransformState = useSiteStore((state) => state.transformState);
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
        state.componentMatrix[currentBootSubscene][
          state.componentMatrixIndices[currentBootSubscene]
        ],
      [currentBootSubscene]
    )
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
              keyPress: keyPress,
              siteRotY: siteTransformState.rotY,
              sitePosY: siteTransformState.posY,
              nodeMatrixIndices: nodeMatrixIndices,
              activeLevel: activeLevel,
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
              bootSubscene: currentBootSubscene,
              activeBootElement: activeBootElement,
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
      currentBootSubscene,
      currentScene,
      inputCooldown,
      nodeMatrixIndices,
      siteTransformState.posY,
      siteTransformState.rotY,
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
      <BootManager eventState={eventState!} />
      <SSknComponentManager eventState={eventState!} />
    </>
  );
};

export default EventManager;
