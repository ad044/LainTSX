import React, { useState, Suspense, useCallback, useEffect } from "react";
import { useFrame, Canvas, useLoader, useThree } from "react-three-fiber";
import Lain, {
  LainIntro,
  LainMoveDown,
  LainMoveLeft,
  LainMoveRight,
  LainMoveUp,
  LainStanding,
} from "./Lain";
import Hub from "./Hub";
//import Orb from "./Orb";
import { OrbitControls, PerspectiveCamera } from "drei";
import Lights from "./Lights";

type KeyCodeAssociations = {
  [keyCode: number]: string;
};

type FrameCounts = {
  [animation: string]: number;
};

const Game = () => {
  const [isLainMoving, setLainMoving] = useState(false);
  const [lainMoveState, setLainMoveState] = useState(<LainStanding />);
  const [lainPosY, setLainPosY] = useState(-0.2);

  const [cameraPosY, setCameraPosY] = useState(0);
  const [cameraRotationY, setCameraRotationY] = useState(0);

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

  const getKeyValue = <U extends keyof T, T extends object>(key: U) => (
    obj: T
  ) => obj[key];

  const getKeyCodeAssociation = (keyCode: number): string => {
    return getKeyValue<keyof KeyCodeAssociations, KeyCodeAssociations>(keyCode)(
      {
        40: "down",
        37: "left",
        38: "up",
        39: "right",
      }
    );
  };

  const getFrameCount = (animation: string): number => {
    return getKeyValue<keyof FrameCounts, FrameCounts>(animation)({
      up: 36,
      down: 36,
      left: 47,
      right: 47,
    });
  };

  // frameCount / FPS * 1000 to turn it into seconds
  // 0.27 is a proportional value i calculated from the avg duration of an animation
  // in the original game
  const getAnimationDuration = (animation: string): number => {
    const frameCount = getFrameCount(animation);
    return (frameCount / (frameCount * 0.27)) * 1000;
  };

  const setAnimationState = (key: string) => {
    switch (key) {
      case "down":
        setLainMoveState(<LainMoveDown />);
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
    }, getAnimationDuration(key));
  };

  const handleUserKeyPress = useCallback(
    (event) => {
      const { _, keyCode } = event;

      const key = getKeyCodeAssociation(keyCode);

      console.log(key);

      if (!isLainMoving) {
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
    [isLainMoving]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);

    document.getElementsByTagName("canvas")[0].className = "hub-background";

    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
      document.getElementsByTagName("body")[0].className = "";
    };
  }, [handleUserKeyPress]);

  return (
    <>
      {/* <Canvas camera={{ position: [0, 0, -2] }}> */}
      <Canvas>
        <PerspectiveCamera
          position={[0, cameraPosY, 3]}
          rotation={[0, cameraRotationY, 0]}
        >
          <OrbitControls />
          <Lain
            isLainMoving={isLainMoving}
            lainMoveState={lainMoveState}
            lainPosY={lainPosY}
          />
          <Hub />
          <Lights />
        </PerspectiveCamera>
      </Canvas>
    </>
  );
};

export default Game;
