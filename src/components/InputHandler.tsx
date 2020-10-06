import React, { useCallback, useEffect, useState } from "react";
import {
  LainMoveDown,
  LainMoveLeft,
  LainMoveRight,
  LainMoveUp,
  LainStanding,
} from "./Lain/Lain";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  bigHudTextAtom,
  bigLetterPosXAtom,
  bigLetterPosYAtom,
  currentHUDAtom,
  hudActiveAtom,
} from "./HUD/HUDElementAtom";
import { currentBlueOrbAtom } from "./BlueOrb/CurrentBlueOrbAtom";
import lain_animations from "../resources/lain_animations.json";
import blue_orb_huds from "../resources/blue_orb_huds.json";
import blue_orb_directions from "../resources/blue_orb_directions.json";
import site_a from "../resources/site_a.json";
import { lainMoveStateAtom, lainMovingAtom } from "./Lain/LainAtom";
import { BlueOrbHuds } from "./HUD/HUDElement";
import {
  middleRingAnimDurationAtom,
  middleRingNoiseAtom,
  middleRingPosYAtom,
  middleRingRotatingAtom,
  middleRingRotXAtom,
  middleRingRotZAtom,
  middleRingWobbleStrengthAtom,
} from "./MiddleRing/MiddleRingAtom";
import { bigLetterOffsetXCoeffAtom } from "./TextRenderer/TextRendererAtom";
import { SiteData } from "./Site/Site";
import { sitePosYAtom, siteRotYAtom } from "./Site/SiteAtom";

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

// helpers
const getMove = (currentLoc: string, key: string): string => {
  return (blue_orb_directions as SpriteDirections)[currentLoc][key];
};

const getKeyCodeAssociation = (keyCode: number): string => {
  return ({
    40: "down",
    37: "left",
    38: "up",
    39: "right",
  } as KeyCodeAssociations)[keyCode];
};

const InputHandler = () => {
  const [currentBlueOrb, setCurrentBlueOrb] = useRecoilState(
    currentBlueOrbAtom
  );

  const [lainMoving, setLainMoving] = useRecoilState(lainMovingAtom);
  const setLainMoveState = useSetRecoilState(lainMoveStateAtom);

  const [spriteUpdateCooldown, setSpriteUpdateCooldown] = useState(false);

  const setCurrentHUDElement = useSetRecoilState(currentHUDAtom);

  const setHudActive = useSetRecoilState(hudActiveAtom);

  const setMiddleRingWobbleStrength = useSetRecoilState(
    middleRingWobbleStrengthAtom
  );
  const setMiddleRingRotating = useSetRecoilState(middleRingRotatingAtom);
  const setMiddleRingNoise = useSetRecoilState(middleRingNoiseAtom);
  const setMiddleRingPosY = useSetRecoilState(middleRingPosYAtom);
  const setMiddleRingRotX = useSetRecoilState(middleRingRotXAtom);
  const setMiddleRingRotZ = useSetRecoilState(middleRingRotZAtom);
  const setMiddleRingAnimDuration = useSetRecoilState(
    middleRingAnimDurationAtom
  );

  const setSiteRotY = useSetRecoilState(siteRotYAtom);
  const setSitePosY = useSetRecoilState(sitePosYAtom);

  const setBigLetterOffSetXCoeff = useSetRecoilState(bigLetterOffsetXCoeffAtom);
  const setBigLetterPosY = useSetRecoilState(bigLetterPosYAtom);
  const setBigLetterPosX = useSetRecoilState(bigLetterPosXAtom);
  const setBigHudText = useSetRecoilState(bigHudTextAtom);

  // hud toggler (animating hud from left to right)
  const toggleHud = useCallback(() => {
    setHudActive((prev: number) => Number(!prev));
  }, [setHudActive]);

  //  ===================================== BIG TEXT ANIMATIONS ================================================

  const animateBigText = useCallback(
    (move: string) => {
      // make current hud big text shrink
      setBigLetterOffSetXCoeff(-1);

      setTimeout(() => {
        // animate it to new pos x/y
        setBigLetterPosX(
          (blue_orb_huds as BlueOrbHuds)[move.substr(2)]["big_text"][0]
        );
        setBigLetterPosY(
          (blue_orb_huds as BlueOrbHuds)[move.substr(2)]["big_text"][1]
        );
      }, 400);

      setTimeout(() => {
        // change hud while its hidden
        setCurrentHUDElement((blue_orb_huds as BlueOrbHuds)[move.substr(2)]);
        // toggle it again to be shown in the new position
        toggleHud();
      }, 500);

      setTimeout(() => {
        setBigHudText((site_a as SiteData)[move]["node_name"]);
      }, 1000);

      setTimeout(() => {
        setBigLetterOffSetXCoeff(0);
      }, 1200);
    },
    [
      setBigHudText,
      setBigLetterOffSetXCoeff,
      setBigLetterPosX,
      setBigLetterPosY,
      setCurrentHUDElement,
      toggleHud,
    ]
  );

  //  ===================================== MIDDLE RING ANIMATIONS ================================================

  const rotateMiddleRing = useCallback(
    (direction: string) => {
      setTimeout(() => {
        setMiddleRingRotZ(direction === "left" ? 0.07 : -0.07);
      }, 2300);

      setTimeout(() => {
        setMiddleRingRotZ(direction === "left" ? -0.03 : 0.03);
      }, 3500);

      setTimeout(() => {
        setMiddleRingRotZ(0);
      }, 4500);
    },
    [setMiddleRingRotZ]
  );

  const moveMiddleRingUp = useCallback(() => {
    // make noise appear again
    setTimeout(() => {
      setMiddleRingNoise(0.06);
    }, 800);

    // disable rotation of the ring
    setTimeout(() => {
      setMiddleRingRotating(false);
    }, 700);

    // set ring rotation on x axis to craete motion effect
    setTimeout(() => {
      setMiddleRingRotX(0.3);
    }, 1500);

    // rotate it again, set ring noise to 0
    setTimeout(() => {
      setMiddleRingRotX(-0.1);
      setMiddleRingNoise(0);
    }, 3500);

    // rotate it back AGAIN (holy fuk psx game)
    setTimeout(() => {
      setMiddleRingRotX(0.05);
    }, 4500);

    // reset value, set noise to 0
    setTimeout(() => {
      setMiddleRingRotX(0);
      setMiddleRingRotating(true);
    }, 4800);

    // enable noise again in about 11-12 secs
    setTimeout(() => {
      setMiddleRingNoise(0.03);
    }, 11600);
  }, [setMiddleRingNoise, setMiddleRingRotX, setMiddleRingRotating]);

  const moveMiddleRingDown = useCallback(() => {
    // change noise to 0, make the ring bend downwards
    setTimeout(() => {
      setMiddleRingNoise(0);
      setMiddleRingWobbleStrength(0.2);
    }, 300);

    // disable rotation of the ring
    setTimeout(() => {
      setMiddleRingRotating(false);
    }, 700);

    // make the ring bend upwards
    setTimeout(() => {
      setMiddleRingWobbleStrength(-0.3);
    }, 1300);

    // reset the ring bend, set the rotation to slightly curve
    // to replicate a motion effect (since its moving upwards)
    // and enable rotation again
    setTimeout(() => {
      setMiddleRingWobbleStrength(0.0);
      setMiddleRingRotX(-0.2);
      setMiddleRingRotating(true);
    }, 1500);

    // reset the rotation value to 0
    setTimeout(() => {
      setMiddleRingRotX(0);
    }, 2500);

    // enable noise again in about 8~ secs
    setTimeout(() => {
      setMiddleRingNoise(0.03);
    }, 7800);
  }, [
    setMiddleRingNoise,
    setMiddleRingRotX,
    setMiddleRingRotating,
    setMiddleRingWobbleStrength,
  ]);

  const setAnimationState = useCallback(
    (key: string) => {
      switch (key) {
        case "down":
          setLainMoveState(<LainMoveDown />);

          setTimeout(() => {
            setSitePosY((prev: number) => prev + 1.5);
          }, 1300);

          moveMiddleRingDown();
          break;
        case "left":
          setTimeout(() => {
            setSiteRotY((prev: number) => prev + Math.PI / 4);
          }, 1100);

          setLainMoveState(<LainMoveLeft />);

          rotateMiddleRing("left");
          break;
        case "up":
          setLainMoveState(<LainMoveUp />);

          setTimeout(() => {
            setSitePosY((prev: number) => prev - 1.5);
            // the middle ring stays in place, therefore we animate it
            // in the same direction as the site, creating that illusion.

            // set the anim duration value to match that of the site's
            setMiddleRingAnimDuration(1500);
            // animate it after
            setMiddleRingPosY((prev: number) => prev - 1.5);
          }, 1100);

          // reset anim duration back to default
          setTimeout(() => {
            setMiddleRingAnimDuration(500);
          }, 2300);

          setTimeout(() => {
            setMiddleRingPosY((prev: number) => prev + 1.7);
          }, 2400);

          setTimeout(() => {
            setMiddleRingPosY((prev: number) => prev - 0.2);
          }, 2400);

          moveMiddleRingUp();
          break;
        case "right":
          setTimeout(() => {
            setSiteRotY((prev: number) => prev - Math.PI / 4);
          }, 1100);

          setLainMoveState(<LainMoveRight />);

          rotateMiddleRing("right");
          break;
        default:
          break;
      }

      // set moving to true to avoid player from overlapping animations and stuff
      // by waiting for the anim to finish
      setLainMoving(true);

      // wait for the anim to finish, set lain to standing state, release the move lock
      setTimeout(() => {
        setLainMoveState(<LainStanding />);
        setTimeout(() => {
          setLainMoving(false);
        }, 300);
      }, (lain_animations as LainAnimations)[key]["duration"]);
    },
    [
      setLainMoveState,
      setLainMoving,
      moveMiddleRingUp,
      moveMiddleRingDown,
      rotateMiddleRing,
      setMiddleRingAnimDuration,
      setMiddleRingPosY,
      setSitePosY,
      setSiteRotY,
    ]
  );

  const dispatchAction = useCallback(
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
            // get rid of the +, since its useless after code execution is already here
            const filteredMove = move.substr(1);

            toggleHud();
            // disable glow on current sprite
            setCurrentBlueOrb("");
            setSpriteUpdateCooldown(true);
            setAnimationState(key);
            setTimeout(() => {
              toggleHud();
              // skip the "+"
              setCurrentBlueOrb(filteredMove);
              setCurrentHUDElement(
                (blue_orb_huds as BlueOrbHuds)[filteredMove.substr(2)]
              );
            }, (lain_animations as LainAnimations)[key]["duration"] + 200);

            animateBigText(filteredMove);

            setTimeout(() => {
              setSpriteUpdateCooldown(false);
            }, 1000);
          }
          break;
        // only change sprite focus
        default:
          if (!spriteUpdateCooldown) {
            setCurrentBlueOrb(move);
            setSpriteUpdateCooldown(true);
            toggleHud();

            animateBigText(move);
            setTimeout(() => {
              setSpriteUpdateCooldown(false);
            }, 1000);
          }
      }
    },
    [
      setAnimationState,
      toggleHud,
      spriteUpdateCooldown,
      setCurrentHUDElement,
      setCurrentBlueOrb,
      animateBigText,
    ]
  );

  const handleKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      const key = getKeyCodeAssociation(keyCode);

      if (key && !lainMoving) {
        const move = getMove(currentBlueOrb, key);

        dispatchAction(move, key);
      }
    },
    [lainMoving, currentBlueOrb, dispatchAction]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return null;
};

export default InputHandler;
