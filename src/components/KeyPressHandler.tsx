import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  getBootSceneContext,
  getEndSceneContext,
  getMainSceneContext,
  getMediaSceneContext,
  getSSknSceneContext,
  playAudio,
  useStore,
} from "../store";
import { getKeyCodeAssociation } from "../utils/keyPressUtils";
import mediaManager from "../core/setters/media/mediaManager";
import handleMediaSceneKeyPress from "../core/scene-keypress-handlers/handleMediaSceneKeyPress";
import sceneManager from "../core/setters/sceneManager";
import levelSelectionManager from "../core/setters/main/level_selection/levelSelectionManager";
import nodeManager from "../core/setters/main/site/nodeManager";
import levelManager from "../core/setters/main/site/levelManager";
import lainManager from "../core/setters/main/site/lainManager";
import siteManager from "../core/setters/main/site/siteManager";
import pauseManager from "../core/setters/main/pause/pauseManager";
import mainSubsceneManager from "../core/setters/main/mainSubsceneManager";
import ssknManager from "../core/setters/sskn/ssknManager";
import handleSSknSceneKeyPress from "../core/scene-keypress-handlers/handleSSknSceneKeyPress";
import handleMainSceneKeyPress from "../core/scene-keypress-handlers/handleMainSceneKeyPress";
import gameLoader from "../core/setters/gameLoader";
import gameSaver from "../core/setters/gameSaver";
import progressManager from "../core/setters/progressManager";
import promptManager from "../core/setters/promptManager";
import bootSubsceneManager from "../core/setters/boot/bootSubsceneManager";
import bootManager from "../core/setters/boot/bootManager";
import handleBootSceneKeyPress from "../core/scene-keypress-handlers/handleBootSceneKeyPress";
import soundManager from "../core/setters/soundManager";
import { useFrame } from "react-three-fiber";
import { getRandomIdleLainAnim, getRandomIdleMedia } from "../utils/idle-utils";
import idleManager from "../core/setters/main/idleManager";
import * as audio from "../static/sfx";
import handleEndSceneKeyPress from "../core/scene-keypress-handlers/handleEndSceneKeyPress";
import endManager from "../core/setters/end/endManager";
import sleep from "../utils/sleep";

const KeyPressHandler = () => {
  const mediaSceneSetters = useMemo(
    () => [
      mediaManager,
      sceneManager,
      nodeManager,
      levelManager,
      siteManager,
      progressManager,
      mainSubsceneManager,
      soundManager,
    ],
    []
  );
  const ssknSceneSetters = useMemo(
    () => [ssknManager, sceneManager, progressManager],
    []
  );
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
      progressManager,
      promptManager,
      soundManager,
    ],
    []
  );

  const bootSceneSetters = useMemo(
    () => [
      bootSubsceneManager,
      bootManager,
      promptManager,
      gameLoader,
      soundManager,
      sceneManager,
    ],
    []
  );

  const endSceneSetters = useMemo(
    () => [sceneManager, soundManager, endManager],
    []
  );

  const scene = useStore((state) => state.currentScene);
  const mainSubscene = useStore((state) => state.mainSubscene);

  const lainIdleCounter = useRef(-1);
  const idleSceneCounter = useRef(-1);

  useFrame(() => {
    const now = Date.now();
    if (
      lainIdleCounter.current > -1 &&
      idleSceneCounter.current > -1 &&
      mainSubscene !== "pause" &&
      mainSubscene !== "level_selection" &&
      scene === "main"
    ) {
      if (now > lainIdleCounter.current + 10000) {
        lainManager({ event: getRandomIdleLainAnim() });
        // after one idle animation plays, the second comes sooner than it would after a regular keypress
        lainIdleCounter.current = now - 2500;
      }
      if (now > idleSceneCounter.current + 30000) {
        (async () => {
          idleManager(getRandomIdleMedia());
          playAudio(audio.sound32);
          await sleep(1200);

          sceneManager({ event: "play_idle_media" });
          // put it on lock until the next action, since while the idle media plays, the
          // Date.now() value keeps increasing, which can result in another idle media playing right after one finishes
          // one way to work around this would be to modify the value depending on the last played idle media's duration
          // but i'm way too lazy for that
          idleSceneCounter.current = -1;
        })();
      }
    }
  });

  useEffect(() => {
    if (scene !== "main") idleSceneCounter.current = -1;
  }, [scene]);

  const handleKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      const keyPress = getKeyCodeAssociation(keyCode);

      const now = Date.now();

      if (keyPress) {
        if (scene === "main") {
          lainIdleCounter.current = now;
          idleSceneCounter.current = now;
        }
        const sceneFns = (() => {
          switch (scene) {
            case "main":
              return {
                contextProvider: getMainSceneContext,
                handler: handleMainSceneKeyPress,
                setters: mainSceneSetters,
              };
            case "media":
              return {
                contextProvider: getMediaSceneContext,
                handler: handleMediaSceneKeyPress,
                setters: mediaSceneSetters,
              };
            case "sskn":
              return {
                contextProvider: getSSknSceneContext,
                handler: handleSSknSceneKeyPress,
                setters: ssknSceneSetters,
              };
            case "boot":
              return {
                contextProvider: getBootSceneContext,
                handler: handleBootSceneKeyPress,
                setters: bootSceneSetters,
              };
            case "end":
              return {
                contextProvider: getEndSceneContext,
                handler: handleEndSceneKeyPress,
                setters: endSceneSetters,
              };
            case "gate":
            case "polytan":
              return {
                action: () => useStore.setState({ currentScene: "main" }),
              };
            case "idle_media":
              return {
                action: () =>
                  useStore.setState({
                    currentScene: "main",
                    idleStarting: false,
                  }),
              };
          }
        })();

        if (sceneFns) {
          // in case of polytan/gate we only need to do one thing, which is reset the scene.
          // we check for that here
          if (sceneFns.action) {
            sceneFns.action();
          } else {
            const { contextProvider, handler, setters } = { ...sceneFns };
            const ctx = { ...contextProvider(), keyPress: keyPress };
            const event = handler(ctx);
            if (event) {
              setters.forEach((fn) => fn(event));
            }
          }
        }
      }
    },
    [
      bootSceneSetters,
      endSceneSetters,
      mainSceneSetters,
      mediaSceneSetters,
      scene,
      ssknSceneSetters,
    ]
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
