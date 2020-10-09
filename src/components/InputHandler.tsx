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
  mediumHudTextAtom,
} from "./HUD/HUDElementAtom";
import { currentBlueOrbAtom } from "./BlueOrb/CurrentBlueOrbAtom";
import lain_animations from "../resources/lain_animations.json";
import blue_orb_huds from "../resources/blue_orb_huds.json";
import blue_orb_directions from "../resources/blue_orb_directions.json";
import site_a from "../resources/site_a.json";
import { lainMoveStateAtom, lainMovingAtom } from "./Lain/LainAtom";
import { BlueOrbHudData, BlueOrbHuds } from "./HUD/HUDElement";
import {
  middleRingAnimDurationAtom,
  middleRingNoiseAtom,
  middleRingRotatingAtom,
  middleRingRotXAtom,
  middleRingRotZAtom,
  middleRingPosYAtom,
  middleRingWobbleStrengthAtom,
} from "./MiddleRing/MiddleRingAtom";
import { bigLetterOffsetXCoeffAtom } from "./TextRenderer/TextRendererAtom";
import { SiteData } from "./Site/Site";
import {
  isSiteYChangingAtom,
  sitePosYAtom,
  siteRotYAtom,
} from "./Site/SiteAtom";

type KeyCodeAssociations = {
  [keyCode: number]: string;
};

// any temporarily
type BlueOrbDirectionData = {
  [direction: string]: any;
};

type BlueOrbDirections = {
  [sprite_id: string]: BlueOrbDirectionData;
};

type LainAnimationData = {
  frame_count: number;
  duration: number;
};
type LainAnimations = {
  [sprite: string]: LainAnimationData;
};

// helpers
const getTargetFrom = (
  currentBlueOrb: string,
  direction: string
): { id: string; hud: string } => {
  const key = `${currentBlueOrb}_${direction}`;
  return blue_orb_directions[key as keyof typeof blue_orb_directions];
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
  const setIsSiteYChanging = useSetRecoilState(isSiteYChangingAtom);

  const setBigLetterOffSetXCoeff = useSetRecoilState(bigLetterOffsetXCoeffAtom);
  const setBigLetterPosY = useSetRecoilState(bigLetterPosYAtom);
  const setBigLetterPosX = useSetRecoilState(bigLetterPosXAtom);
  const setBigHudText = useSetRecoilState(bigHudTextAtom);

  const setMediumHudText = useSetRecoilState(mediumHudTextAtom);

  // hud toggler (animating hud from left to right)
  const toggleHud = useCallback(() => {
    setHudActive((prev: number) => Number(!prev));
  }, [setHudActive]);

  //  ===================================== BIG TEXT ANIMATIONS ================================================

  const animateBigTextWithMove = useCallback(
    (targetBlueOrbId: string, targetHudId: string, moveDirection: string) => {
      setTimeout(() => {
        switch (moveDirection) {
          case "up":
            setBigLetterPosY((prev: number) => prev - 1.5);

            break;
          case "down":
            setBigLetterPosY((prev: number) => prev + 1.5);
            break;
          default:
            break;
        }
      }, 1300);

      setTimeout(() => {
        // make current hud big text shrink
        setBigLetterOffSetXCoeff(-1);
      }, 2500);

      setTimeout(() => {
        setBigLetterPosX(
          blue_orb_huds[targetHudId as keyof typeof blue_orb_huds].big_text[0]
        );
        setBigLetterPosY(
          blue_orb_huds[targetHudId as keyof typeof blue_orb_huds].big_text[1]
        );
        setBigHudText((site_a as SiteData)[targetBlueOrbId].node_name);
      }, 3000);

      setTimeout(() => {
        setBigLetterOffSetXCoeff(0);
      }, 3900);
    },
    [
      setBigHudText,
      setBigLetterOffSetXCoeff,
      setBigLetterPosX,
      setBigLetterPosY,
    ]
  );

  const animateBigTextStatic = useCallback(
    (targetBlueOrbId: string, targetHudId: string) => {
      // make current hud big text shrink
      setBigLetterOffSetXCoeff(-1);

      setTimeout(() => {
        // animate it to new pos x/y
        setBigLetterPosX(
          blue_orb_huds[targetHudId as keyof typeof blue_orb_huds].big_text[0]
        );
        setBigLetterPosY(
          blue_orb_huds[targetHudId as keyof typeof blue_orb_huds].big_text[1]
        );
      }, 400);

      setTimeout(() => {
        setBigHudText(site_a[targetBlueOrbId as keyof typeof site_a].node_name);
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

  const moveMiddleRingDown = useCallback(() => {
    // set the anim duration value to match that of the site's
    setMiddleRingAnimDuration(1200);

    // make noise appear again
    setTimeout(() => {
      setMiddleRingNoise(0.06);
    }, 800);

    // disable rotation of the ring
    setTimeout(() => {
      setMiddleRingRotating(false);
    }, 700);

    setTimeout(() => {
      setMiddleRingPosY((prev: number) => prev + 1.5);
    }, 1300);

    // set ring rotation on x axis to craete motion effect
    setTimeout(() => {
      setMiddleRingRotX(0.3);
    }, 1500);

    setTimeout(() => {
      setMiddleRingAnimDuration(600);
    }, 2900);

    setTimeout(() => {
      setMiddleRingPosY((prev: number) => prev - 1.7);
    }, 3000);

    setTimeout(() => {
      setMiddleRingPosY((prev: number) => prev + 0.2);
    }, 3150);

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
  }, [
    setMiddleRingAnimDuration,
    setMiddleRingNoise,
    setMiddleRingPosY,
    setMiddleRingRotX,
    setMiddleRingRotating,
  ]);

  const moveMiddleRingUp = useCallback(() => {
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
      // the middle ring stays in place, therefore we animate it
      // in the same direction as the site, creating that illusion.

      // set the anim duration value to match that of the site's
      setMiddleRingAnimDuration(1200);
      // animate it after
      setMiddleRingPosY((prev: number) => prev - 1.5);
    }, 1300);

    // reset the ring bend, set the rotation to slightly curve
    // to replicate a motion effect (since its moving upwards)
    // and enable rotation again
    setTimeout(() => {
      setMiddleRingWobbleStrength(0.0);
      setMiddleRingRotX(-0.2);
      setMiddleRingRotating(true);
    }, 1500);

    // reset anim duration back to default
    setTimeout(() => {
      setMiddleRingAnimDuration(600);
    }, 2300);

    setTimeout(() => {
      setMiddleRingPosY((prev: number) => prev + 1.7);
    }, 2400);

    // reset the rotation value to 0
    setTimeout(() => {
      setMiddleRingRotX(0);
      setMiddleRingPosY((prev: number) => prev - 0.2);
    }, 2650);

    // enable noise again in about 8~ secs
    setTimeout(() => {
      setMiddleRingNoise(0.03);
    }, 7800);
  }, [
    setMiddleRingAnimDuration,
    setMiddleRingNoise,
    setMiddleRingPosY,
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
          setLainMoveState(<LainMoveLeft />);

          setTimeout(() => {
            setSiteRotY((prev: number) => prev + Math.PI / 4);
          }, 1100);

          rotateMiddleRing("left");
          break;
        case "up":
          setLainMoveState(<LainMoveUp />);

          setTimeout(() => {
            setSitePosY((prev: number) => prev - 1.5);
          }, 1300);

          moveMiddleRingUp();
          break;
        case "right":
          setLainMoveState(<LainMoveRight />);

          setTimeout(() => {
            setSiteRotY((prev: number) => prev - Math.PI / 4);
          }, 1100);

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
      }, lain_animations[key as keyof typeof lain_animations].duration);
    },
    [
      setLainMoveState,
      setLainMoving,
      moveMiddleRingUp,
      moveMiddleRingDown,
      rotateMiddleRing,
      setSitePosY,
      setSiteRotY,
    ]
  );

  const moveAndChangeSpriteFocus = useCallback(
    (
      targetBlueOrbId: string,
      targetBlueOrbHudData: BlueOrbHudData,
      targetBlueOrbGreenText: string,
      moveDirection: string,
      targetBlueOrbHudId: string
    ) => {
      setIsSiteYChanging(true);
      toggleHud();

      // disable glow on current sprite
      setCurrentBlueOrb("");

      setSpriteUpdateCooldown(true);

      setAnimationState(moveDirection);

      setTimeout(() => {
        toggleHud();
        // skip the "+"
        setCurrentBlueOrb(targetBlueOrbId);
        setCurrentHUDElement(targetBlueOrbHudData);
        setMediumHudText(targetBlueOrbGreenText);
      }, lain_animations[moveDirection as keyof typeof lain_animations].duration);

      animateBigTextWithMove(
        targetBlueOrbId,
        targetBlueOrbHudId,
        moveDirection
      );

      setTimeout(() => {
        setSpriteUpdateCooldown(false);
      }, 1000);

      setTimeout(() => {
        setIsSiteYChanging(false);
      }, 3000);
    },
    [
      animateBigTextWithMove,
      setAnimationState,
      setCurrentBlueOrb,
      setCurrentHUDElement,
      setIsSiteYChanging,
      setMediumHudText,
      toggleHud,
    ]
  );

  const changeSpriteFocus = useCallback(
    (
      targetBlueOrbId: string,
      targetBlueOrbHudData: BlueOrbHudData,
      targetBlueOrbGreenText: string,
      targetBlueOrbHudId: string
    ) => {
      setCurrentBlueOrb(targetBlueOrbId);
      setSpriteUpdateCooldown(true);
      toggleHud();

      setTimeout(() => {
        setCurrentHUDElement(targetBlueOrbHudData);
        setMediumHudText(targetBlueOrbGreenText);
        toggleHud();
      }, 500);

      animateBigTextStatic(targetBlueOrbId, targetBlueOrbHudId);

      setTimeout(() => {
        setSpriteUpdateCooldown(false);
      }, 1300);
    },
    [
      animateBigTextStatic,
      setCurrentBlueOrb,
      setCurrentHUDElement,
      setMediumHudText,
      toggleHud,
    ]
  );

  const handleKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      const moveDirection = getKeyCodeAssociation(keyCode);

      if (moveDirection && !lainMoving && !spriteUpdateCooldown) {
        const targetBlueOrb = getTargetFrom(currentBlueOrb, moveDirection);

        const targetBlueOrbHudId = targetBlueOrb.hud;
        const targetBlueOrbHudData =
          blue_orb_huds[targetBlueOrbHudId as keyof typeof blue_orb_huds];

        const targetBlueOrbIdUnfiltered = targetBlueOrb.id;

        const targetBlueOrbIdFiltered =
          targetBlueOrbIdUnfiltered[0] === "+"
            ? targetBlueOrbIdUnfiltered.substr(1)
            : targetBlueOrbIdUnfiltered;

        const targetBlueOrbGreenText =
          site_a[targetBlueOrbIdFiltered as keyof typeof site_a].green_text;

        if (targetBlueOrbIdUnfiltered[0] === "+") {
          moveAndChangeSpriteFocus(
            targetBlueOrbIdFiltered,
            targetBlueOrbHudData,
            targetBlueOrbGreenText,
            moveDirection,
            targetBlueOrbHudId
          );
        } else {
          changeSpriteFocus(
            targetBlueOrbIdFiltered,
            targetBlueOrbHudData,
            targetBlueOrbGreenText,
            targetBlueOrbHudId
          );
        }
      }
    },
    [
      lainMoving,
      spriteUpdateCooldown,
      currentBlueOrb,
      moveAndChangeSpriteFocus,
      changeSpriteFocus,
    ]
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
