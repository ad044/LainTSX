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
import { MouseEvent, useLoader } from "react-three-fiber";
import circleButton from "../static/sprites/controller/circle.png";
import squareButton from "../static/sprites/controller/square.png";
import triangleButton from "../static/sprites/controller/triangle.png";
import crossButton from "../static/sprites/controller/cross.png";
import startButton from "../static/sprites/controller/start.png";
import l2Button from "../static/sprites/controller/l2.png";
import * as THREE from "three";
import { useGesture } from "react-use-gesture";
import IdleManager from "./IdleManager";

type InputHandlerProps = {
  isMobile: boolean;
};

const InputHandler = (props: InputHandlerProps) => {
  const scene = useStore((state) => state.currentScene);
  const inputCooldown = useStore((state) => state.inputCooldown);

  const circleButtonTex = useLoader(THREE.TextureLoader, circleButton);
  const crossButtonTex = useLoader(THREE.TextureLoader, crossButton);
  const squareButtonTex = useLoader(THREE.TextureLoader, squareButton);
  const triangleButtonTex = useLoader(THREE.TextureLoader, triangleButton);
  const startButtonTex = useLoader(THREE.TextureLoader, startButton);
  const l2ButtonTex = useLoader(THREE.TextureLoader, l2Button);

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

  const bind = useGesture(
    {
      onDragEnd: ({ axis, direction: xy }) => {
        if (axis === "x") {
          if (xy[0] > 0) handleKeyPress("RIGHT");
          else handleKeyPress("LEFT");
        } else {
          if (xy[1] > 0) handleKeyPress("DOWN");
          else handleKeyPress("UP");
        }
      },
    },
    { drag: { delay: true } }
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

  const handleVirtualButtonPress = useCallback(
    (event: MouseEvent) => {
      handleKeyPress(event.object.name);
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
    <>
      {props.isMobile && (
        <>
          <sprite scale={[10, 10, 0]} renderOrder={99999} {...bind()}>
            <spriteMaterial attach="material" opacity={0} depthTest={false} />
          </sprite>

          <sprite
            scale={[1.5, 1.5, 0]}
            position={[-4, 3, 0]}
            renderOrder={99999}
            onClick={handleVirtualButtonPress}
            name={"L2"}
          >
            <spriteMaterial
              attach="material"
              map={l2ButtonTex}
              depthTest={false}
              opacity={0.8}
            />
          </sprite>

          <sprite
            scale={[1.5, 1.5, 0]}
            position={[4, 3, 0]}
            renderOrder={99999}
            onClick={handleVirtualButtonPress}
            name={"START"}
          >
            <spriteMaterial
              attach="material"
              map={startButtonTex}
              depthTest={false}
              opacity={0.8}
            />
          </sprite>

          <group
            scale={[0.8, 0.8, 0]}
            position={[3.5, -2.3, 0]}
            renderOrder={9999}
          >
            <sprite
              scale={[1.5, 1.5, 0]}
              position={[1, 0, 0]}
              onClick={handleVirtualButtonPress}
              name={"CIRCLE"}
            >
              <spriteMaterial
                attach="material"
                map={circleButtonTex}
                depthTest={false}
                opacity={0.8}
              />
            </sprite>
            <sprite
              scale={[1.5, 1.5, 0]}
              position={[0, -1, 0]}
              onClick={handleVirtualButtonPress}
              name={"CROSS"}
            >
              <spriteMaterial
                attach="material"
                map={crossButtonTex}
                depthTest={false}
                opacity={0.8}
              />
            </sprite>
            <sprite
              scale={[1.5, 1.5, 0]}
              position={[0, 1, 0]}
              onClick={handleVirtualButtonPress}
              name={"TRIANGLE"}
            >
              <spriteMaterial
                attach="material"
                map={triangleButtonTex}
                depthTest={false}
                opacity={0.8}
              />
            </sprite>
            <sprite
              scale={[1.5, 1.5, 0]}
              position={[-1, 0, 0]}
              onClick={handleVirtualButtonPress}
              name={"square"}
            >
              <spriteMaterial
                attach="material"
                map={squareButtonTex}
                depthTest={false}
                opacity={0.8}
              />
            </sprite>
          </group>
        </>
      )}
      <IdleManager
        lainIdleTimerRef={lainIdleTimerRef}
        idleSceneTimerRef={idleSceneTimerRef}
      />
    </>
  );
};

export default InputHandler;
