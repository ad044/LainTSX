import React, { useCallback, useEffect, useRef, memo } from "react";
import { useStore } from "@/store";
import { handleEvent, handleInput } from "@/core";
import { GameEvent, GameScene, Key } from "@/types";
import IdleManager from "@canvas/objects/IdleManager";

const InputHandler = () => {
  const scene = useStore((state) => state.scene);
  const inputCooldown = useStore((state) => state.inputCooldown);
  const keybindings = useStore((state) => state.keybindings);

  const timeSinceLastKeyPress = useRef(-1);

  const lainIdleTimerRef = useRef(-1);
  const idleSceneTimerRef = useRef(-1);

  const handleKeyPress = useCallback(
    (key: Key) => {
      const now = Date.now();

      if (
        now > timeSinceLastKeyPress.current + inputCooldown &&
        inputCooldown !== -1
      ) {
        timeSinceLastKeyPress.current = now;
        if (scene === GameScene.Main) {
          lainIdleTimerRef.current = now;
          idleSceneTimerRef.current = now;
        }

        const ctx = useStore.getState();
        const event: GameEvent | null = handleInput(ctx, key);

        if (event) handleEvent(event);
      }
    },
    [inputCooldown, scene]
  );

  const firedRef = useRef(false);

  const handleKeyBoardEvent = useCallback(
    (event: KeyboardEvent) => {
      if (!firedRef.current) {
        firedRef.current = true;

        let key = event.key;
        // make the keybinds work with caps lock on aswell
        if (key.length === 1) {
          key = key.toLowerCase();
        }

        if (key in keybindings) handleKeyPress(keybindings[key]);
      }
    },
    [handleKeyPress, keybindings]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyBoardEvent);

    window.addEventListener("keyup", () => {
      firedRef.current = false;
    });

    return () => {
      window.removeEventListener("keydown", handleKeyBoardEvent);
    };
  }, [handleKeyBoardEvent]);

  return (
    <IdleManager
      lainIdleTimerRef={lainIdleTimerRef}
      idleSceneTimerRef={idleSceneTimerRef}
    />
  );
};

export default memo(InputHandler);
