import { a, useSpring } from "@react-spring/three";
import { OrbitControls } from "drei";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFrame } from "react-three-fiber";
import lain_animations from "../resources/lain_animations.json";
import level_sprite_directions from "../resources/level_sprite_directions.json";
import level_sprite_huds from "../resources/level_sprite_huds.json";
import Hub from "./Hub";
import Lain, {
  LainMoveDown,
  LainMoveLeft,
  LainMoveRight,
  LainMoveUp,
  LainStanding,
  LainIntro,
} from "./Lain";
import Lights from "./Lights";
import OrthoCamera from "./OrthoCamera";
import Preloader from "./Preloader";
import Starfield from "./Starfield";
import * as THREE from "three";

type KeyCodeAssociations = {
  [keyCode: number]: string;
};

type SpriteDirectionData = {
  [direction: string]: string;
};

type SpriteDirections = {
  [sprite_id: string]: SpriteDirectionData;
};

type HudShapeData = {
  position: number[];
  scale: number[];
  type: string;
  initial_position: number[];
};

type SpriteHudData = {
  long: HudShapeData;
  boring: HudShapeData;
  big: HudShapeData;
};

type SpriteHuds = {
  [sprite_hud_id: string]: SpriteHudData;
};

type LainAnimationData = {
  frame_count: number;
  duration: number;
};
type LainAnimations = {
  [sprite: string]: LainAnimationData;
};

const Game = () => {
  const [isIntro, setIsIntro] = useState(false);

  const [isLainMoving, setLainMoving] = useState(false);
  const [lainMoveState, setLainMoveState] = useState(<LainStanding />);

  const [orthoCameraPosY, setOrthoCameraPosY] = useState(0);

  const [currentSprite, setCurrentSprite] = useState("0422");
  const [currentSpriteHUD, setCurrentSpriteHUD] = useState<SpriteHudData>(
    (level_sprite_huds as SpriteHuds)[currentSprite.substr(2)]
  );
  const [spriteUpdateCooldown, setSpriteUpdateCooldown] = useState(false);

  const [HUDActive, setHUDActive] = useState(1);

  const { bigHUDPositionX } = useSpring({
    bigHUDPositionX: HUDActive,
    config: { duration: 500 },
  });

  const { longHUDPositionX } = useSpring({
    longHUDPositionX: HUDActive,
    config: { duration: 500 },
  });

  const { boringHUDPositionX } = useSpring({
    boringHUDPositionX: HUDActive,
    config: { duration: 500 },
  });

  const bigHUDPosX = bigHUDPositionX.to(
    [0, 1],
    [
      currentSpriteHUD["big"]["initial_position"][0],
      currentSpriteHUD["big"]["position"][0],
    ]
  );

  const boringHUDPosX = boringHUDPositionX.to(
    [0, 1],
    [
      currentSpriteHUD["boring"]["initial_position"][0],
      currentSpriteHUD["boring"]["position"][0],
    ]
  );

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

  const [{ starfieldPositionY }, setStarfieldPositionY] = useSpring(
    () => ({
      starfieldPositionY: -0.5,
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

  const moveStarfield = useCallback(
    (val: number) =>
      void setTimeout(
        () =>
          setStarfieldPositionY(() => ({
            starfieldPositionY: starfieldPositionY.get() + val,
          })),
        1300
      ),
    [starfieldPositionY, setStarfieldPositionY]
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
  const starfieldPosY = starfieldPositionY.to([0, 1], [0, Math.PI]);

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
          moveCamera(0.6);
          moveStarfield(-0.6);
          moveLain(-0.6);
          setLainMoveState(<LainMoveDown />);
          break;
        case "left":
          rotateCamera(0.15);
          setLainMoveState(<LainMoveLeft />);
          break;
        case "up":
          moveCamera(-0.6);
          moveStarfield(0.6);
          moveLain(0.6);
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
    [moveCamera, moveLain, rotateCamera, moveStarfield]
  );

  const updateHUD = useCallback(() => {
    setHUDActive((prev: number) => Number(!prev));
  }, [setHUDActive]);

  const moveDispatcher = useCallback(
    (move: string, key: string) => {
      console.log(move[0]);
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
              setOrthoCameraPosY(1.88);
              updateHUD();
              setCurrentSprite(move.substr(1));
              setCurrentSpriteHUD(
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
              setCurrentSpriteHUD(
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
    [setAnimationState, updateHUD, spriteUpdateCooldown]
  );

  const handleKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      const key = getKeyCodeAssociation(keyCode);

      if (key && !isLainMoving) {
        const move = getMove(currentSprite, key);

        console.log(key);

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

  const groupRef = useRef<THREE.Object3D>();

  useFrame(() => {
    if (isIntro) {
      if (groupRef.current!.rotation.x > 0) {
        if (groupRef.current!.position.z > -1) {
          groupRef.current!.rotation.x -= 0.015;
        } else {
          groupRef.current!.rotation.x -= 0.01;
        }
      }
      if (groupRef.current!.position.y > 0) {
        groupRef.current!.position.y -= 0.015;
      }

      if (groupRef.current!.position.z < 0) {
        groupRef.current!.position.z += 0.04;
      }

      // if the rotation hits this value that means that the intro is finished.
      // using a settimeout or something similar resulted in clunkiness, since it was dependant
      // on load times.
      if (parseFloat(groupRef.current!.rotation.x.toPrecision(2)) === -0.005) {
        updateHUD();
        setLainMoving(false);
        setLainMoveState(<LainStanding />);
        setIsIntro(false);
      }
    }
  });

  // on load, move the hud to the right (out of vision), and set lain sprite to intro
  useEffect(() => {
    setIsIntro(true);
    updateHUD();
    setLainMoving(true);
    setLainMoveState(<LainIntro />);
  }, [updateHUD]);

  // pos-z ? => 3
  // rot-x 1.5 => 0
  // grp rot/pos both 0,0,0 => ?
  return (
    <a.perspectiveCamera
      position-z={3}
      position-y={camPosY}
      rotation-y={camRotY}
    >
      <group rotation={[2.3, 0, 0]} position={[0, 1.5, -7.5]} ref={groupRef}>
        <Suspense fallback={null}>
          <Preloader />
          <Hub currentSprite={currentSprite} />
          <OrthoCamera
            longHUDPosX={longHUDPosX}
            bigHUDPosX={bigHUDPosX}
            boringHUDPosX={boringHUDPosX}
            longHUDPosYZ={[
              currentSpriteHUD!["long"]["position"][1],
              currentSpriteHUD!["long"]["position"][2],
            ]}
            boringHUDPosYZ={[
              currentSpriteHUD!["boring"]["position"][1],
              currentSpriteHUD!["boring"]["position"][2],
            ]}
            bigHUDPosYZ={[
              currentSpriteHUD!["big"]["position"][1],
              currentSpriteHUD!["big"]["position"][2],
            ]}
            longHUDType={currentSpriteHUD!["long"]["type"]}
            boringHUDType={currentSpriteHUD!["boring"]["type"]}
            bigHUDType={currentSpriteHUD!["big"]["type"]}
            longHUDScale={
              currentSpriteHUD!["long"]["scale"] as [number, number, number]
            }
            boringHUDScale={
              currentSpriteHUD!["boring"]["scale"] as [number, number, number]
            }
            bigHUDScale={
              currentSpriteHUD!["big"]["scale"] as [number, number, number]
            }
            orthoCameraPosY={orthoCameraPosY}
            id={currentSprite}
            orbVisibility={!isIntro}
            hudVisibility={!isIntro}
          />
          <Starfield starfieldPosY={starfieldPosY} />
          <Lights />
          <OrbitControls />
        </Suspense>
      </group>
      <Lain
        isLainMoving={isLainMoving}
        lainMoveState={lainMoveState}
        lainPosY={lainPosY}
      />
    </a.perspectiveCamera>
  );
};
export default Game;
