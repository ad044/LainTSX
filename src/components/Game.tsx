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
import { OrbitControls } from "drei";

type KeyCodeAssociations = {
  [keyCode: number]: string;
};

type FrameCounts = {
  [animation: string]: number;
};

// value by which to rotate/move the ring on the y axis
type LowerRingValues = {
  [direction: string]: number;
};

const Game = () => {
  const [isLainMoving, setLainMoving] = useState(false);
  const [lainMoveState, setLainMoveState] = useState(<LainStanding />);

  const [lowerRingRotationY, setLowerRingRotationY] = useState(5);
  const [lowerRingPositionY, setLowerRingPositionY] = useState(-0.31);

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

  const getLowerRingValue = (direction: string) => {
    return getKeyValue<keyof LowerRingValues, LowerRingValues>(direction)({
      left: 0.002,
      right: -0.002,
      up: -0.005,
      down: 0.005,
    });
  };

  const rotateLowerRing = (key: string, duration: number) => {
    const rotationInterval = setInterval(() => {
      setLowerRingRotationY((prev) => prev + getLowerRingValue(key));
    }, 10);

    setTimeout(() => {
      clearInterval(rotationInterval);
    }, duration);
  };

  const moveLowerRing = (key: string, duration: number) => {
    const moveInterval = setInterval(() => {
      setLowerRingPositionY((prev) => prev + getLowerRingValue(key));
    });

    setTimeout(() => {
      clearInterval(moveInterval);
    }, duration);
  };

  const handleUserKeyPress = useCallback(
    (event) => {
      const { _, keyCode } = event;

      const key = getKeyCodeAssociation(keyCode);

      console.log(key);
      if (!isLainMoving) {
        setAnimationState(key);
        setTimeout(() => {
          switch (key) {
            case "left":
            case "right":
              rotateLowerRing(key, 1000);
              break;
            case "up":
            case "down":
              moveLowerRing(key, 1000);
              break;
            default:
              break;
          }
        }, 1200);
      }
    },
    [isLainMoving]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);

    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  return (
    <>
      <Canvas shadowMap concurrent camera={{ position: [0, -0.1, -2] }}>
        <Lain isLainMoving={isLainMoving} lainMoveState={lainMoveState} />
        <Hub
          lowerRingRotationY={lowerRingRotationY}
          lowerRingPositionY={lowerRingPositionY}
        />
        <ambientLight color={0x808080} />
        <pointLight color={0xffffff} position={[0, 0, 700]} intensity={0.5} />
        <pointLight color={0x7f7f7f} position={[0, 1000, 0]} intensity={1} />
        <pointLight color={0xffffff} position={[0, 0, 0]} intensity={0.1} />
      </Canvas>
    </>
  );
};

export default Game;
