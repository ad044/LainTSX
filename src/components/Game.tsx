import React, {
  useState,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import { Canvas, useLoader, useThree } from "react-three-fiber";
import Lain, {
  LainIntro,
  LainMoveDown,
  LainMoveLeft,
  LainMoveRight,
  LainMoveUp,
  LainStanding,
} from "./Lain";
import Hub, { PositionAndScaleProps } from "./Hub";
//import Orb from "./Orb";
import { OrbitControls, PerspectiveCamera } from "drei";
import Lights from "./Lights";
import OrthoCamera from "./OrthoCamera";
import TWEEN from "@tweenjs/tween.js";
import moveDownSpriteSheet from "../static/sprites/jump_down.png";
import moveUpSpriteSheet from "../static/sprites/jump_up.png";

import level_sprite_directions from "../resources/level_sprite_directions.json";
import lain_animations from "../resources/lain_animations.json";
import level_sprite_huds from "../resources/level_sprite_huds.json";
import * as THREE from "three";

type KeyCodeAssociations = {
  [keyCode: number]: string;
};

type SpriteDirections = {
  [key: string]: Record<string, string>;
};

// will fix the typing on this later
type SpriteHuds = {
  [key: string]: Record<string, any>;
};

type LainAnimations = {
  [key: string]: Record<string, number>;
};

const Game = () => {
  const [isLainMoving, setLainMoving] = useState(false);
  const [lainIntro, setLainIntro] = useState(false);
  const [lainMoveUp, setLainMoveUp] = useState(false);
  const [lainMoveDown, setLainMoveDown] = useState(false);
  const [lainMoveState, setLainMoveState] = useState(<LainStanding />);
  const [lainPosY, setLainPosY] = useState(-0.2);

  const [cameraPosY, setCameraPosY] = useState(0);
  const [cameraRotationY, setCameraRotationY] = useState(0);

  const [currentSprite, setCurrentSprite] = useState("043");

  // we separate positions of the hud sprites into the state since we need to animate thme
  const [longHudPosition, setLongHudPosition] = useState<
    PositionAndScaleProps
  >();
  const [boringHudPosition, setBoringHudPosition] = useState<
    PositionAndScaleProps
  >();
  const [bigHudPosition, setBigHudPosition] = useState<PositionAndScaleProps>();

  const getMove = (currentLoc: string, key: string): string => {
    return (level_sprite_directions as SpriteDirections)[currentLoc][key];
  };

  const getHudData = (sprite: string) => {
    return (level_sprite_huds as SpriteHuds)[sprite];
  };

  const moveCamera = (value: number, duration: number) => {
    const moveInterval = setInterval(() => {
      setCameraPosY((prev: number) => prev + value);
      setLainPosY((prev: number) => prev - value);
    });

    setTimeout(() => {
      clearInterval(moveInterval);
    }, duration);
  };

  const rotateCamera = (value: number, duration: number) => {
    const rotationInterval = setInterval(() => {
      setCameraRotationY((prev: number) => prev + value);
    });

    setTimeout(() => {
      clearInterval(rotationInterval);
    }, duration);
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
      const move = getMove(currentSprite, key);

      switch (key) {
        case "down":
          // "+" in the json denotes that the sprite chosen by getMove is not currently on screen,
          // therefore lain should first do a move (up/down/left/right) and then that sprite
          // will be chosen.
          if (move[0] !== "+") setCurrentSprite(move);
          else {
            setLainMoveState(<LainMoveDown />);
            setTimeout(() => {
              setCurrentSprite(move);
            }, (lain_animations as LainAnimations)[key]["duration"] + 200);
          }
          break;
        case "left":
          setLainMoveState(<LainMoveLeft />);
          break;
        case "up":
          setLainMoveState(<LainMoveUp />);
          break;
        case "right":
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
    [currentSprite]
  );

  const handleUserKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      const key = getKeyCodeAssociation(keyCode);

      console.log(key);

      if (!isLainMoving && key) {
        setAnimationState(key);
        switch (key) {
          case "left":
            setTimeout(() => {
              rotateCamera(0.001, 1600);
            }, 1100);
            break;
          case "right":
            setTimeout(() => {
              rotateCamera(-0.001, 1600);
            }, 1100);
            break;
          case "up":
            setTimeout(() => {
              moveCamera(-0.005, 1200);
            }, 1300);
            break;
          case "down":
            setTimeout(() => {
              moveCamera(0.005, 1200);
            }, 1300);
            break;
          default:
            break;
        }
      }
    },
    [isLainMoving, setAnimationState]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);

    document.getElementsByTagName("canvas")[0].className = "hub-background";

    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
      document.getElementsByTagName("body")[0].className = "";
    };
  }, [handleUserKeyPress]);

  const animateSpriteHUDIn = () => {
    //wip
    const initialLongPos = getHudData(currentSprite)["long"]["initial"];
    const finalLongPos = getHudData(currentSprite)["long"]["initial"];
    const pos = getHudData(currentSprite)["long"]["position"];
    const pos1 = getHudData(currentSprite)["big"]["position"];
    const pos2 = getHudData(currentSprite)["boring"]["position"];
    setBigHudPosition(pos1);
    setLongHudPosition(pos);
    setBoringHudPosition(pos2);
  };

  useEffect(animateSpriteHUDIn, []);

  function Preload() {
    const moveDown = useLoader(THREE.TextureLoader, moveDownSpriteSheet);
    const moveUp = useLoader(THREE.TextureLoader, moveUpSpriteSheet);
    const { gl } = useThree();
    useLayoutEffect(() => {
      gl.initTexture(moveDown);
      gl.initTexture(moveUp);
    }, [moveDown, moveUp]);
    return null;
  }

  return (
    <>
      <Canvas concurrent>
        <PerspectiveCamera
          position={[0, cameraPosY, 3]}
          rotation={[0, cameraRotationY, 0]}
        >
          <Suspense fallback={null}>
            <OrbitControls />
            <Preload />
            <Lain
              isLainMoving={isLainMoving}
              lainMoveState={lainMoveState}
              lainPosY={lainPosY}
            />
            <Hub currentSprite={currentSprite} />
            <Lights />
            <OrthoCamera
              bigHudPosition={bigHudPosition!}
              boringHudPosition={boringHudPosition!}
              longHudPosition={longHudPosition!}
              longHudType={getHudData(currentSprite)["long"]["type"]}
              boringHudType={getHudData(currentSprite)["boring"]["type"]}
              bigHudType={getHudData(currentSprite)["big"]["type"]}
              longHudScale={getHudData(currentSprite)["long"]["scale"]}
              boringHudScale={getHudData(currentSprite)["boring"]["scale"]}
              bigHudScale={getHudData(currentSprite)["big"]["scale"]}
              id={getHudData(currentSprite)["id"]}
            />
          </Suspense>
        </PerspectiveCamera>
      </Canvas>
    </>
  );
};
export default Game;
