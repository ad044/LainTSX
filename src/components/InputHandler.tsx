import React, { useCallback, useEffect, useRef, memo } from "react";
import {
  getBootSceneContext,
  getEndSceneContext,
  getMainSceneContext,
  getMediaSceneContext,
  getSsknSceneContext,
  useStore,
} from "../store";
import getKeyPress from "../utils/getKeyPress";
import handleMediaSceneInput from "../core/input-handlers/handleMediaSceneInput";
import handleSsknSceneInput from "../core/input-handlers/handleSsknSceneInput";
import handleMainSceneInput from "../core/input-handlers/handleMainSceneInput";
import handleBootSceneInput from "../core/input-handlers/handleBootSceneInput";
import handleEndSceneInput from "../core/input-handlers/handleEndSceneInput";
import handleEvent from "../core/handleEvent";
import { GameEvent } from "../types/types";
import IdleManager from "./IdleManager";

const InputHandler = memo(() => {
  const scene = useStore((state) => state.currentScene);
  const inputCooldown = useStore((state) => state.inputCooldown);

  const timeSinceLastKeyPress = useRef(-1);

  const lainIdleTimerRef = useRef(-1);
  const idleSceneTimerRef = useRef(-1);

  const handleKeyPress = useCallback(
    (keyPress: string) => {
      const now = Date.now();

      if (
        now > timeSinceLastKeyPress.current + inputCooldown &&
        inputCooldown !== -1
      ) {
        timeSinceLastKeyPress.current = now;
        if (scene === "main") {
          lainIdleTimerRef.current = now;
          idleSceneTimerRef.current = now;
        }

        const sceneFns = (() => {
          switch (scene) {
            case "main":
              return {
                contextProvider: getMainSceneContext,
                keyPressHandler: handleMainSceneInput,
              };
            case "media":
              return {
                contextProvider: getMediaSceneContext,
                keyPressHandler: handleMediaSceneInput,
              };
            case "sskn":
              return {
                contextProvider: getSsknSceneContext,
                keyPressHandler: handleSsknSceneInput,
              };
            case "boot":
              return {
                contextProvider: getBootSceneContext,
                keyPressHandler: handleBootSceneInput,
              };
            case "end":
              return {
                contextProvider: getEndSceneContext,
                keyPressHandler: handleEndSceneInput,
              };
            case "gate":
            case "polytan":
              useStore.setState({ currentScene: "main" });
              break;
            case "idle_media":
              useStore.setState({
                currentScene: "main",
                idleStarting: false,
                intro: false,
                inputCooldown: -1,
              });
              break;
          }
        })();

        if (sceneFns) {
          const { contextProvider, keyPressHandler } = sceneFns;

          const ctx = contextProvider();
          const event: GameEvent | undefined = keyPressHandler(
            ctx as any,
            keyPress
          );
          if (event) handleEvent(event);
        }
      }
    },
    [inputCooldown, scene]
  );

  const firedRef = useRef(false);

  const handleKeyBoardEvent = useCallback(
    (event) => {
      if (!firedRef.current) {
        firedRef.current = true;
        const key = getKeyPress(event.key);

        if (key) handleKeyPress(key);
      }
    },
    [handleKeyPress]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyBoardEvent);

    window.addEventListener("keyup", () => {
      firedRef.current = false;
    });

    return () => {
      window.removeEventListener("keydown", handleKeyBoardEvent);
      window.removeEventListener("keyup", () => {
        firedRef.current = false;
      });
    };
  }, [handleKeyBoardEvent]);

  return (
    <IdleManager
      lainIdleTimerRef={lainIdleTimerRef}
      idleSceneTimerRef={idleSceneTimerRef}
    />
  );
});

export default InputHandler;
