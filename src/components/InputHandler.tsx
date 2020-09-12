import React, { useCallback, useEffect, useState } from "react";
import {
  LainMoveDown,
  LainMoveLeft,
  LainMoveRight,
  LainMoveUp,
  LainStanding,
} from "./Lain/Lain";
import { useRecoilState, useSetRecoilState } from "recoil";
import { hudActiveAtom } from "./HUD/HUDActiveAtom";
import { currentSpriteAtom } from "./LevelSprite/CurrentSpriteAtom";
import lain_animations from "../resources/lain_animations.json";
import level_sprite_huds from "../resources/level_sprite_huds.json";
import level_sprite_directions from "../resources/level_sprite_directions.json";
import {
  lainMoveStateAtom,
  lainMovingAtom,
  lainPosYAtom,
} from "./Lain/LainAtom";
import { camPosYAtom, camRotYAtom } from "./MainScene/CameraAtom";
import { starfieldPosYAtom } from "./Starfield/StarfieldAtom";
import { currentHUDAtom } from "./HUD/CurrentHUDAtom";
import { SpriteHuds } from "./HUD/HUDElement";
import { orthoCamPosYAtom } from "./OrthoCamera/OrthoCameraAtom";

type KeyCodeAssociations = {
  [keyCode: number]: string;
};

type SpriteDirectionData = {
  [direction: string]: string;
};

type SpriteDirections = {
  [sprite_id: string]: SpriteDirectionData;
};

type LainAnimationData = {
  frame_count: number;
  duration: number;
};
type LainAnimations = {
  [sprite: string]: LainAnimationData;
};

const InputHandler = () => {
  const [currentSprite, setCurrentSprite] = useRecoilState(currentSpriteAtom);

  const [lainMoving, setLainMoving] = useRecoilState(lainMovingAtom);
  const setLainMoveState = useSetRecoilState(lainMoveStateAtom);

  const [spriteUpdateCooldown, setSpriteUpdateCooldown] = useState(false);

  const setCurrentHUDElement = useSetRecoilState(currentHUDAtom);

  const setHudActive = useSetRecoilState(hudActiveAtom);

  const setCamPosY = useSetRecoilState(camPosYAtom);
  const setCamRotY = useSetRecoilState(camRotYAtom);

  const setOrthoCamPosY = useSetRecoilState(orthoCamPosYAtom);

  const setLainPosY = useSetRecoilState(lainPosYAtom);

  const setStarfieldPosY = useSetRecoilState(starfieldPosYAtom);

  const moveCamera = useCallback(
    (val: number) => {
      setCamPosY((prev: number) => prev + val);
      setLainPosY((prev: number) => prev - val);
      setStarfieldPosY((prev: number) => prev - val);
      setOrthoCamPosY((prev: number) => prev - val);
    },
    [setCamPosY, setLainPosY, setStarfieldPosY, setOrthoCamPosY]
  );

  const rotateCamera = useCallback(
    (val: number) => {
      setCamRotY((prev: number) => prev + val);
    },
    [setCamRotY]
  );

  const getMove = (currentLoc: string, key: string): string => {
    return (level_sprite_directions as SpriteDirections)[currentLoc][key];
  };

  const getKeyCodeAssociation = (keyCode: number): string => {
    return ({
      40: "down",
      37: "left",
      38: "up",
      39: "right",
    } as KeyCodeAssociations)[keyCode];
  };

  const setAnimationState = useCallback(
    (key: string) => {
      switch (key) {
        case "down":
          setLainMoveState(<LainMoveDown />);
          setTimeout(() => {
            moveCamera(1.87);
          }, 1400);

          break;
        case "left":
          rotateCamera(0.15);
          setLainMoveState(<LainMoveLeft />);
          break;
        case "up":
          setLainMoveState(<LainMoveUp />);
          setTimeout(() => {
            moveCamera(-1.87);
          }, 1300);
          break;
        case "right":
          rotateCamera(-0.1);
          setLainMoveState(<LainMoveRight />);
          break;
        default:
          break;
      }

      // set moving to true to avoid player from overlapping animations and stuff
      // by waiting for the anim to finish
      setLainMoving(true);

      // wait for the anim to finish, set lain to standing state, release the move lock
      setTimeout(() => {
        setLainMoving(false);
        setLainMoveState(<LainStanding />);
      }, (lain_animations as LainAnimations)[key]["duration"]);
    },
    [moveCamera, rotateCamera, setLainMoveState, setLainMoving]
  );

  const updateHUD = useCallback(() => {
    setHudActive((prev: number) => Number(!prev));
  }, [setHudActive]);

  const moveDispatcher = useCallback(
    (move: string, key: string) => {
      switch (move[0]) {
        // do nothing / cant move
        case undefined:
          break;
        // "+" in the json denotes that the sprite chosen by getMove is not currently on screen,
        // therefore lain should first do a move (up/down/left/right) and then that sprite
        // will be chosen.
        case "+":
          if (!spriteUpdateCooldown) {
            // hide the hud
            updateHUD();
            // disable glow on current sprite
            setCurrentSprite("");
            setSpriteUpdateCooldown(true);
            setAnimationState(key);
            setTimeout(() => {
              updateHUD();
              // skip the "+"
              setCurrentSprite(move.substr(1));
              setCurrentHUDElement(
                (level_sprite_huds as SpriteHuds)[move.substr(3)]
              );
            }, (lain_animations as LainAnimations)[key]["duration"] + 200);
            setTimeout(() => {
              setSpriteUpdateCooldown(false);
            }, 1000);
          }
          break;
        // only change sprite focus
        default:
          if (!spriteUpdateCooldown) {
            setCurrentSprite(move);
            setSpriteUpdateCooldown(true);
            // toggle hud to go back in
            updateHUD();
            setTimeout(() => {
              // change hud while its hidden
              setCurrentHUDElement(
                (level_sprite_huds as SpriteHuds)[move.substr(2)]
              );
              // toggle it again to be shown in the new position
              updateHUD();
            }, 500);
            setTimeout(() => {
              setSpriteUpdateCooldown(false);
            }, 1000);
          }
      }
    },
    [
      setAnimationState,
      updateHUD,
      spriteUpdateCooldown,
      setCurrentHUDElement,
      setCurrentSprite,
    ]
  );

  const handleKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      const key = getKeyCodeAssociation(keyCode);

      if (key && !lainMoving) {
        const move = getMove(currentSprite, key);

        moveDispatcher(move, key);
      }
    },
    [lainMoving, currentSprite, moveDispatcher]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return <></>;
};

export default InputHandler;
