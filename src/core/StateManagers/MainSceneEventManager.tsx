import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { getMainSceneContext, useStore } from "../../store";
import handleMainSceneEvent from "../mainSceneEventHandler";
import { getKeyCodeAssociation } from "../../utils/keyPressUtils";
import { useFrame } from "react-three-fiber";
import levelSelectionManager from "../setters/main/level_selection/levelSelectionManager";
import lainManager from "../setters/main/site/lainManager";
import levelManager from "../setters/main/site/levelManager";
import nodeManager from "../setters/main/site/nodeManager";
import pauseManager from "../setters/main/pause/pauseManager";
import siteManager from "../setters/main/site/siteManager";
import mainSubsceneManager from "../setters/main/mainSubsceneManager";
import sceneManager from "../setters/sceneManager";

type MainSceneEventManagerProps = {
  loaded: boolean;
};

const MainSceneEventManager = (props: MainSceneEventManagerProps) => {
  const mainSubscene = useStore((state) => state.mainSubscene);

  const timePassedSinceLastKeyPress = useRef(-1);

  const mainSceneSetters = useMemo(
    () => [
      levelSelectionManager,
      nodeManager,
      levelManager,
      lainManager,
      siteManager,
      pauseManager,
      mainSubsceneManager,
      sceneManager,
    ],
    []
  );

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
        timePassedSinceLastKeyPress.current = -1;
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
        // setEventState({ event: event });
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
        const ctx = { ...getMainSceneContext(), keyPress: keyPress };

        const event = handleMainSceneEvent(ctx);
        mainSceneSetters.forEach((fn) => fn(event));
      }
    },
    [mainSceneSetters, props.loaded]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return null;
};

export default MainSceneEventManager;
