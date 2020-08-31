import { a, useSpring, update } from "@react-spring/three";
//import Orb from "./Orb";
import { OrbitControls } from "drei";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import { Canvas } from "react-three-fiber";
import lain_animations from "../resources/lain_animations.json";
import level_sprite_directions from "../resources/level_sprite_directions.json";
import level_sprite_huds from "../resources/level_sprite_huds.json";
import Hub, { PositionAndScaleProps } from "./Hub";
import Lain, {
  LainMoveDown,
  LainMoveLeft,
  LainMoveRight,
  LainMoveUp,
  LainStanding,
} from "./Lain";
import Lights from "./Lights";
import OrthoCamera from "./OrthoCamera";
import Preloader from "./Preloader";

type KeyCodeAssociations = {
  [keyCode: number]: string;
};

type SpriteDirections = {
  [key: string]: Record<string, string>;
};

// will fix the typing on this later
type SpriteHuds = {
  [key: string]: Record<string, any> | any;
};

type LainAnimations = {
  [key: string]: Record<string, number>;
};

const Game = () => {
  const [isLainMoving, setLainMoving] = useState(false);
  const [lainMoveState, setLainMoveState] = useState(<LainStanding />);

  const [currentSprite, setCurrentSprite] = useState("043");
  const [currentSpriteHUD, setCurrentSpriteHUD] = useState<SpriteHuds>(
    (level_sprite_huds as SpriteHuds)[currentSprite]
  );

  const [longHUDActive, setLongHUDActive] = useState(1);

  const { longHUDPositionX } = useSpring({
    longHUDPositionX: longHUDActive,
    config: { duration: 500 },
  });

  const longHUDPosX = longHUDPositionX.to(
    [0, 1],
    [
      currentSpriteHUD["long"]["initial_position"][0],
      currentSpriteHUD["long"]["position"][0],
    ]
  );

  const [{ cameraRotationY }, setCameraRotationY] = useSpring(
    () => ({
      cameraRotationY: 0,
      config: { precision: 0.0001, duration: 1600 },
    }),
    []
  );

  const [{ cameraPositionY }, setCameraPositionY] = useSpring(
    () => ({
      cameraPositionY: 0,
      config: { precision: 0.0001, duration: 1200 },
    }),
    []
  );

  const [{ lainPositionY }, setLainPositionY] = useSpring(
    () => ({
      lainPositionY: -0.06,
      config: { precision: 0.0001, duration: 1200 },
    }),
    []
  );

  const moveCamera = useCallback(
    (val: number) =>
      void setTimeout(
        () =>
          setCameraPositionY(() => ({
            cameraPositionY: cameraPositionY.get() + val,
          })),
        1300
      ),
    [cameraPositionY, setCameraPositionY]
  );

  const moveLain = useCallback(
    (val: number) =>
      void setTimeout(
        () =>
          setLainPositionY(() => ({
            lainPositionY: lainPositionY.get() + val,
          })),
        1300
      ),
    [setLainPositionY, lainPositionY]
  );

  const rotateCamera = useCallback(
    (val: number) =>
      void setTimeout(
        () =>
          setCameraRotationY(() => ({
            cameraRotationY: cameraRotationY.get() + val,
          })),
        1100
      ),
    [setCameraRotationY, cameraRotationY]
  );

  const camRotY = cameraRotationY.to([0, 1], [0, Math.PI]);
  const camPosY = cameraPositionY.to([0, 1], [0, Math.PI]);
  const lainPosY = lainPositionY.to([0, 1], [0, Math.PI]);

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
          moveCamera(0.3);
          moveLain(-0.3);
          setLainMoveState(<LainMoveDown />);
          break;
        case "left":
          rotateCamera(0.1);
          setLainMoveState(<LainMoveLeft />);
          break;
        case "up":
          moveCamera(-0.3);
          moveLain(0.3);
          setLainMoveState(<LainMoveUp />);
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
    [moveCamera, moveLain, rotateCamera]
  );

  const updateHUD = useCallback(() => {
    setLongHUDActive((prev: number) => Number(!prev));
  }, [setLongHUDActive]);

  const moveDispatcher = useCallback(
    (move: string, key: string) => {
      switch (move[0]) {
        // do nothing / cant move
        case "":
          break;
        // "+" in the json denotes that the sprite chosen by getMove is not currently on screen,
        // therefore lain should first do a move (up/down/left/right) and then that sprite
        // will be chosen.
        case "+":
          setAnimationState(key);
          setTimeout(() => {
            setCurrentSprite(move);
            setCurrentSpriteHUD((level_sprite_huds as SpriteHuds)[move]);
          }, (lain_animations as LainAnimations)[key]["duration"] + 200);
          break;
        // only change sprite focus
        default:
          setCurrentSprite(move);
          // toggle hud to go back in
          updateHUD();
          setTimeout(() => {
            // change hud while its hidden
            setCurrentSpriteHUD((level_sprite_huds as SpriteHuds)[move]);
            // toggle it again to be shown in the new position
            updateHUD();
          }, 500);
      }
    },
    [setAnimationState, updateHUD]
  );

  const handleKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      const key = getKeyCodeAssociation(keyCode);

      const move = getMove(currentSprite, key);

      console.log(key);

      if (!isLainMoving && key) {
        moveDispatcher(move, key);
      }
    },
    [isLainMoving, currentSprite, moveDispatcher]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    document.getElementsByTagName("canvas")[0].className = "hub-background";

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      document.getElementsByTagName("body")[0].className = "";
    };
  }, [handleKeyPress]);

  return (
    <Canvas concurrent>
      <a.perspectiveCamera
        position-z={3}
        position-y={camPosY}
        rotation-y={camRotY}
      >
        <Suspense fallback={null}>
          <OrbitControls />
          <Preloader />
          <Lain
            isLainMoving={isLainMoving}
            lainMoveState={lainMoveState}
            lainPosY={lainPosY}
          />
          <Hub currentSprite={currentSprite} />
          <Lights />
          <OrthoCamera
            // bigHudPosition={bigHudPosition!}
            // boringHudPosition={boringHudPosition!}
            longHUDPosX={longHUDPosX}
            longHudPosition={[
              currentSpriteHUD!["long"]["position"][0],
              currentSpriteHUD!["long"]["position"][1],
              currentSpriteHUD!["long"]["position"][2],
            ]}
            longHudType={currentSpriteHUD!["long"]["type"]}
            boringHudType={currentSpriteHUD!["boring"]["type"]}
            bigHudType={currentSpriteHUD!["big"]["type"]}
            longHudScale={currentSpriteHUD!["long"]["scale"]}
            boringHudScale={currentSpriteHUD!["boring"]["scale"]}
            bigHudScale={currentSpriteHUD!["big"]["scale"]}
            id={currentSpriteHUD!["id"]}
          />
        </Suspense>
      </a.perspectiveCamera>
    </Canvas>
  );
};
export default Game;
