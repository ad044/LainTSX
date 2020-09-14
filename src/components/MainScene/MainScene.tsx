import { a, useSpring } from "@react-spring/three";
import { OrbitControls } from "drei";
import React, { Suspense, useEffect } from "react";
import Hub from "../Hub";
import Lain, { LainIntro } from "../Lain/Lain";
import Lights from "../Lights";
import OrthoCamera from "../OrthoCamera/OrthoCamera";
import Preloader from "../Preloader";
import Starfield from "../Starfield/Starfield";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { lainMoveStateAtom, lainMovingAtom } from "../Lain/LainAtom";
import { camPosYAtom, camRotYAtom } from "./CameraAtom";
import InputHandler from "../InputHandler";
import MainSceneIntro from "./MainSceneIntro";
import {
  mainGroupPosYAtom,
  mainGroupPosZAtom,
  mainGroupRotXAtom,
} from "./MainGroupAtom";
import GrayPlanes from "../GrayPlanes/GrayPlanes";
import MiddleRing from "../MiddleRing/MiddleRing";

const MainScene = () => {
  const setLainMoving = useSetRecoilState(lainMovingAtom);
  const setLainMoveState = useSetRecoilState(lainMoveStateAtom);
  const mainGroupPosY = useRecoilValue(mainGroupPosYAtom);
  const mainGroupPosZ = useRecoilValue(mainGroupPosZAtom);
  const mainGroupRotX = useRecoilValue(mainGroupRotXAtom);

  const camPosY = useRecoilValue(camPosYAtom);
  const camRotY = useRecoilValue(camRotYAtom);

  const cameraState = useSpring({
    camPosY: camPosY,
    camRotY: camRotY,
    config: { duration: 1200 },
  });

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
    setLainMoving(true);
    setLainMoveState(<LainIntro />);
  }, [setLainMoveState, setLainMoving]);

  return (
    <a.perspectiveCamera
      position-z={3}
      position-y={cameraState.camPosY}
      rotation-y={cameraState.camRotY}
    >
      <Suspense fallback={null}>
        <MainSceneIntro />
        <a.group
          rotation-x={mainGroupStateRot.mainGroupRotX}
          position-y={mainGroupStatePos.mainGroupPosY}
          position-z={mainGroupStatePos.mainGroupPosZ}
        >
          <InputHandler />
          <Preloader />
          <Hub />
          <OrthoCamera />
          <Starfield />
          <GrayPlanes />
          <Lights />
          <MiddleRing />
          <OrbitControls />
        </a.group>
        <Lain />
      </Suspense>
    </a.perspectiveCamera>
  );
};
export default MainScene;
