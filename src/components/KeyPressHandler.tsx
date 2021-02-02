import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  getMainSceneContext,
  getMediaSceneContext,
  getSSknSceneContext,
  useStore,
} from "../store";
import { getKeyCodeAssociation } from "../utils/keyPressUtils";
import mediaManager from "../core/setters/media/mediaManager";
import handleMediaSceneEvent from "../core/scene-keypress-handlers/handleMediaKeyPress";
import sceneManager from "../core/setters/sceneManager";
import levelSelectionManager from "../core/setters/main/level_selection/levelSelectionManager";
import nodeManager from "../core/setters/main/site/nodeManager";
import levelManager from "../core/setters/main/site/levelManager";
import lainManager from "../core/setters/main/site/lainManager";
import siteManager from "../core/setters/main/site/siteManager";
import pauseManager from "../core/setters/main/pause/pauseManager";
import mainSubsceneManager from "../core/setters/main/mainSubsceneManager";
import ssknManager from "../core/setters/sskn/ssknManager";
import handleSSknSceneEvent from "../core/scene-keypress-handlers/handleSSknKeyPress";
import handleMainSceneEvent from "../core/scene-keypress-handlers/handleMainKeyPress";
import gameLoader from "../core/setters/gameLoader";
import gameSaver from "../core/setters/gameSaver";

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
      gameLoader,
      gameSaver,
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

      if (keyPress) {
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
