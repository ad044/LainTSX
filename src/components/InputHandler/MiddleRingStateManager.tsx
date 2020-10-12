import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import {
  middleRingAnimDurationAtom,
  middleRingNoiseAtom,
  middleRingPosYAtom,
  middleRingRotatingAtom,
  middleRingRotXAtom,
  middleRingRotZAtom,
  middleRingWobbleStrengthAtom,
} from "../MiddleRing/MiddleRingAtom";
import { StateManagerProps } from "./InputHandler";

const MiddleRingStateManager = (props: StateManagerProps) => {
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

  useEffect(() => {
    if (props.eventState) {
      const moveDirection = props.eventState.moveDirection;

      if (moveDirection) {
        switch (moveDirection) {
          case "down":
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
            break;
          case "left":
            setTimeout(() => {
              setMiddleRingRotZ(0.07);
            }, 2300);

            setTimeout(() => {
              setMiddleRingRotZ(-0.03);
            }, 3500);

            setTimeout(() => {
              setMiddleRingRotZ(0);
            }, 4500);

            break;
          case "up":
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

            break;
          case "right":
            setTimeout(() => {
              setMiddleRingRotZ(-0.07);
            }, 2300);

            setTimeout(() => {
              setMiddleRingRotZ(0.03);
            }, 3500);

            setTimeout(() => {
              setMiddleRingRotZ(0);
            }, 4500);

            break;
          default:
            break;
        }
      }
    }
  }, [
    props.eventState,
    setMiddleRingAnimDuration,
    setMiddleRingNoise,
    setMiddleRingPosY,
    setMiddleRingRotX,
    setMiddleRingRotZ,
    setMiddleRingRotating,
    setMiddleRingWobbleStrength,
  ]);

  return null;
};

export default MiddleRingStateManager;
