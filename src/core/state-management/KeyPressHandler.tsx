import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  getMainSceneContext,
  getMediaSceneContext,
  getSSknSceneContext,
  useStore,
} from "../../store";
import { getKeyCodeAssociation } from "../../utils/keyPressUtils";
import mediaManager from "../state-management/setters/media/mediaManager";
import handleMediaSceneEvent from "./scene-keypress-handlers/handleMediaKeyPress";
import sceneManager from "../state-management/setters/sceneManager";
import levelSelectionManager from "./setters/main/level_selection/levelSelectionManager";
import nodeManager from "./setters/main/site/nodeManager";
import levelManager from "./setters/main/site/levelManager";
import lainManager from "./setters/main/site/lainManager";
import siteManager from "./setters/main/site/siteManager";
import pauseManager from "./setters/main/pause/pauseManager";
import mainSubsceneManager from "./setters/main/mainSubsceneManager";
import ssknManager from "./setters/sskn/ssknManager";
import handleSSknSceneEvent from "./scene-keypress-handlers/handleSSknKeyPress";
import handleMainSceneEvent from "./scene-keypress-handlers/handleMainKeyPress";

const KeyPressHandler = () => {
  const mediaSceneSetters = useMemo(() => [mediaManager, sceneManager], []);
  const ssknSceneSetters = useMemo(() => [ssknManager, sceneManager], []);
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

  const scene = useStore((state) => state.currentScene);

  const timePassedSinceLastKeyPress = useRef(-1);

  const handleKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      const keyPress = getKeyCodeAssociation(keyCode);

      const now = Date.now();

      if (keyPress && now > timePassedSinceLastKeyPress.current + 1500) {
        timePassedSinceLastKeyPress.current = Date.now();

        const sceneFns = (() => {
          switch (scene) {
            case "main":
              return {
                contextProvider: getMainSceneContext,
                handler: handleMainSceneEvent,
                setters: mainSceneSetters,
              };
            case "media":
              return {
                contextProvider: getMediaSceneContext,
                handler: handleMediaSceneEvent,
                setters: mediaSceneSetters,
              };
            case "sskn":
              return {
                contextProvider: getSSknSceneContext,
                handler: handleSSknSceneEvent,
                setters: ssknSceneSetters,
              };
          }
        })();

        if (sceneFns) {
          const { contextProvider, handler, setters } = { ...sceneFns };
          const ctx = { ...contextProvider(), keyPress: keyPress };
          const event = handler(ctx);
          setters.forEach((fn) => fn(event));
        }
      }
    },
    [mainSceneSetters, mediaSceneSetters, scene, ssknSceneSetters]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return null;
};

export default KeyPressHandler;
