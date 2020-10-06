import { a, useSpring } from "@react-spring/three";
import { OrbitControls } from "drei";
import React, { Suspense, useEffect } from "react";
import Site from "../Site/Site";
import Lain from "../Lain/Lain";
import Lights from "../Lights";
import OrthoCamera from "../OrthoCamera/OrthoCamera";
import Preloader from "../Preloader";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { lainMoveStateAtom, lainMovingAtom } from "../Lain/LainAtom";
import InputHandler from "../InputHandler";
import MainSceneIntro from "./MainSceneIntro";
import {
  mainGroupPosYAtom,
  mainGroupPosZAtom,
  mainGroupRotXAtom,
} from "./MainGroupAtom";
import GrayPlanes from "../GrayPlanes/GrayPlanes";
import MiddleRing from "../MiddleRing/MiddleRing";
import Starfield from "../Starfield/Starfield";

const MainScene = () => {
  const setLainMoving = useSetRecoilState(lainMovingAtom);
  const setLainMoveState = useSetRecoilState(lainMoveStateAtom);
  const mainGroupPosY = useRecoilValue(mainGroupPosYAtom);
  const mainGroupPosZ = useRecoilValue(mainGroupPosZAtom);
  const mainGroupRotX = useRecoilValue(mainGroupRotXAtom);

  const mainGroupStatePos = useSpring({
    mainGroupPosY: mainGroupPosY,
    mainGroupPosZ: mainGroupPosZ,
    config: { duration: 3644 },
  });

  const mainGroupStateRot = useSpring({
    mainGroupRotX: mainGroupRotX,
    config: { duration: 1500 },
  });

  // set lain intro spritesheet before the page loads fully
  useEffect(() => {
    // setLainMoving(true);
    // setLainMoveState(<LainIntro />);
  }, [setLainMoveState, setLainMoving]);

  return (
    <perspectiveCamera position-z={3}>
      <Suspense fallback={null}>
        <MainSceneIntro />
        <a.group
          rotation-x={mainGroupStateRot.mainGroupRotX}
          position-y={mainGroupStatePos.mainGroupPosY}
          position-z={mainGroupStatePos.mainGroupPosZ}
        >
          <InputHandler />
          <Preloader />
          <Site />
          <OrthoCamera />
          <Starfield />
          <GrayPlanes />
          <Lights />
          <MiddleRing />
          <OrbitControls />
        </a.group>
        <Lain />
      </Suspense>
    </perspectiveCamera>
  );
};
export default MainScene;
