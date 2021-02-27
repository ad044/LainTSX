import React, { useCallback, useEffect, useRef } from "react";
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
import { useSwipeable } from "react-swipeable";
import IdleManager from "./IdleManager";
import { Canvas } from "react-three-fiber";

const InputHandler = () => {
  const scene = useStore((state) => state.currentScene);
  const inputCooldown = useStore((state) => state.inputCooldown);

  const timeSinceLastKeyPress = useRef(-1);

  const lainIdleTimerRef = useRef(-1);
  const idleSceneTimerRef = useRef(-1);

  const handleKeyPress = useCallback(
    (keyPress: string) => {
      const now = Date.now();

      if (scene === "main") {
        timeSinceLastKeyPress.current = now;
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
    },
    [scene]
  );

  const handlers = useSwipeable({
    onSwiped: (eventData) => handleKeyPress(eventData.dir.toUpperCase()),
    onTap: () => handleKeyPress("CIRCLE"),
  });

  const handleKeyBoardEvent = useCallback(
    (event) => {
      const key = getKeyPress(event.key);

      const now = Date.now();

      if (
        key &&
        now > timeSinceLastKeyPress.current + inputCooldown &&
        inputCooldown !== -1
      ) {
        handleKeyPress(key);
      }
    },
    [handleKeyPress, inputCooldown]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyBoardEvent);

    return () => {
      window.removeEventListener("keydown", handleKeyBoardEvent);
    };
  }, [handleKeyBoardEvent]);

  return (
    <>
      <div {...handlers} className="swipe-handler" />
      <Canvas>
        <IdleManager
          lainIdleTimerRef={lainIdleTimerRef}
          idleSceneTimerRef={idleSceneTimerRef}
        />
      </Canvas>
    </>
  );
};

export default InputHandler;
