import { useCallback, useEffect, useRef } from "react";
import {
  getBootSceneContext,
  getEndSceneContext,
  getMainSceneContext,
  getMediaSceneContext,
  getSsknSceneContext,
  MainSceneContext,
  playAudio,
  useStore,
} from "../store";
import { getKeyCodeAssociation } from "../utils/keyPressUtils";
import handleMediaSceneKeyPress from "../core/scene-keypress-handlers/handleMediaSceneKeyPress";
import handleSsknSceneKeyPress from "../core/scene-keypress-handlers/handleSsknSceneKeyPress";
import handleMainSceneKeyPress from "../core/scene-keypress-handlers/handleMainSceneKeyPress";
import handleBootSceneKeyPress from "../core/scene-keypress-handlers/handleBootSceneKeyPress";
import { useFrame } from "react-three-fiber";
import { getRandomIdleLainAnim } from "../utils/idle-utils";
import * as audio from "../static/sfx";
import handleEndSceneKeyPress from "../core/scene-keypress-handlers/handleEndSceneKeyPress";
import handleMainSceneEvent from "../core/scene-event-handlers/handleMainSceneEvent";
import handleMediaSceneEvent from "../core/scene-event-handlers/handleMediaSceneEvent";
import handleSsknSceneEvent from "../core/scene-event-handlers/handleSsknSceneEvent";
import handleBootSceneEvent from "../core/scene-event-handlers/handleBootSceneEvent";
import handleEndSceneEvent from "../core/scene-event-handlers/handleEndSceneEvent";

const KeyPressHandler = () => {
  const scene = useStore((state) => state.currentScene);
  const mainSubscene = useStore((state) => state.mainSubscene);
  const inputCooldown = useStore((state) => state.inputCooldown);

  const setLainMoveState = useStore((state) => state.setLainMoveState);

  const timeSinceLastKeyPress = useRef(-1);
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
        setLainMoveState(getRandomIdleLainAnim());
        // after one idle animation plays, the second comes sooner than it would after a regular keypress
        lainIdleCounter.current = now - 2500;
      }
      if (now > idleSceneCounter.current + 30000) {
        // put it on lock until the next action, since while the idle media plays, the
        // Date.now() value keeps increasing, which can result in another idle media playing right after one finishes
        // one way to work around this would be to modify the value depending on the last played idle media's duration
        // but i'm way too lazy for that
        idleSceneCounter.current = -1;

        // idleManager(getRandomIdleMedia());
        playAudio(audio.sound32);

        setTimeout(() => {
          // useStore.setState({ event: "play_idle_media" });
        }, 1200);
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

      if (
        keyPress &&
        !inputCooldown &&
        now > timeSinceLastKeyPress.current + 1500
      ) {
        if (scene === "main") {
          lainIdleCounter.current = now;
          idleSceneCounter.current = now;
          timeSinceLastKeyPress.current = now;
        }
        const sceneFns = (() => {
          switch (scene) {
            case "main":
              return {
                contextProvider: getMainSceneContext,
                keyPressHandler: handleMainSceneKeyPress,
                eventHandler: handleMainSceneEvent,
              };
            case "media":
              return {
                contextProvider: getMediaSceneContext,
                keyPressHandler: handleMediaSceneKeyPress,
                eventHandler: handleMediaSceneEvent,
              };
            case "sskn":
              return {
                contextProvider: getSsknSceneContext,
                keyPressHandler: handleSsknSceneKeyPress,
                eventHandler: handleSsknSceneEvent,
              };
            case "boot":
              return {
                contextProvider: getBootSceneContext,
                keyPressHandler: handleBootSceneKeyPress,
                eventHandler: handleBootSceneEvent,
              };
            case "end":
              return {
                contextProvider: getEndSceneContext,
                keyPressHandler: handleEndSceneKeyPress,
                eventHandler: handleEndSceneEvent,
              };
            case "gate":
            case "polytan":
              useStore.setState({ currentScene: "main" });
              break;
            case "idle_media":
              useStore.setState({
                currentScene: "main",
                idleStarting: false,
              });
              break;
          }
        })();

        if (sceneFns) {
          const { contextProvider, keyPressHandler, eventHandler } = sceneFns;

          const ctx = contextProvider(keyPress);
          const event = keyPressHandler(ctx);
          if (event) eventHandler(event);
        }
      }
    },
    [inputCooldown, scene]
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
