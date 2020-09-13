import React, { memo, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { hudActiveAtom, hudVisibilityAtom } from "../HUD/HUDElementAtom";
import {
  mainGroupPosYAtom,
  mainGroupPosZAtom,
  mainGroupRotXAtom,
} from "./MainGroupAtom";
import { LainStanding } from "../Lain/Lain";
import { lainMoveStateAtom, lainMovingAtom } from "../Lain/LainAtom";
import { orbVisibilityAtom } from "../Orb/OrbAtom";
import {
  introStarfieldVisibilityAtom,
  mainStarfieldBoostValAtom,
  mainStarfieldVisibilityAtom,
} from "../Starfield/StarfieldAtom";
import { grayPlanesVisibleAtom } from "../GrayPlanes/GrayPlanesAtom";

// ghost component to manipulate the intro animation for the main scene.

// we separate this file because having something like this
// inside <Suspense> tags makes it behave in a more stable manner
// by waiting for the components to load and synchronously calling the functions.
const MainSceneIntro = memo(() => {
  const setHudActive = useSetRecoilState(hudActiveAtom);

  const setHudVisible = useSetRecoilState(hudVisibilityAtom);
  const setOrbVisible = useSetRecoilState(orbVisibilityAtom);

  const setLainMoving = useSetRecoilState(lainMovingAtom);
  const setLainMoveState = useSetRecoilState(lainMoveStateAtom);

  const setIntroStarfieldVisible = useSetRecoilState(
    introStarfieldVisibilityAtom
  );
  const setMainStarfieldVisible = useSetRecoilState(
    mainStarfieldVisibilityAtom
  );
  const setMainStarfieldBoostVal = useSetRecoilState(mainStarfieldBoostValAtom);

  const setMainGroupPosY = useSetRecoilState(mainGroupPosYAtom);
  const setMainGroupPosZ = useSetRecoilState(mainGroupPosZAtom);
  const setMainGroupRotX = useSetRecoilState(mainGroupRotXAtom);

  const setGrayPlanesVisible = useSetRecoilState(grayPlanesVisibleAtom);

  useEffect(() => {
    setMainGroupPosY(0);
    setMainGroupPosZ(0);
    setTimeout(() => {
      setMainGroupRotX(0);
    }, 2400);

    setTimeout(() => {
      setGrayPlanesVisible(true);
    }, 2500);

    setTimeout(() => {
      setMainStarfieldVisible(true);
      setMainStarfieldBoostVal(0);
    }, 2800);

    setHudActive((prev: number) => Number(!prev));
    setTimeout(() => {
      setLainMoving(false);
      setLainMoveState(<LainStanding />);

      setOrbVisible(true);
      setHudVisible(true);

      setIntroStarfieldVisible(false);

      setHudActive((prev: number) => Number(!prev));

      setTimeout(() => {
        document.getElementsByTagName("canvas")[0].className = "hub-background";
      }, 300);
    }, 3860);
  }, [
    setGrayPlanesVisible,
    setMainStarfieldBoostVal,
    setMainStarfieldVisible,
    setHudVisible,
    setOrbVisible,
    setIntroStarfieldVisible,
    setHudActive,
    setMainGroupRotX,
    setMainGroupPosZ,
    setMainGroupPosY,
    setLainMoving,
    setLainMoveState,
  ]);

  return <></>;
});

export default MainSceneIntro;
