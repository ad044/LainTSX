import { a, useSpring } from "@react-spring/three";
import { OrbitControls } from "drei";
import React, { Suspense, useEffect } from "react";
import Site from "./Site";
import Lain from "./Lain";
import Lights from "./Lights";
import OrthoCamera from "./OrthoCamera";
import Preloader from "./Preloader";
import EventStateManager from "./StateManagers/EventStateManager";
import MainSceneIntro from "./MainSceneIntro";
import GrayPlanes from "./GrayPlanes";
import MiddleRing from "./MiddleRing";
import Starfield from "./Starfield";
import { useBlueOrbStore, useLainStore, useMainGroupStore } from "../store";

const MainScene = () => {
  const setLainMoveState = useLainStore((state) => state.setLainMoveState);
  const setActiveBlueOrb = useBlueOrbStore(
    (state) => state.setActiveBlueOrbId
  );
  const setActiveBlueOrbHudId = useBlueOrbStore(
    (state) => state.setActiveBlueOrbHudId
  );

  const mainGroupPosY = useMainGroupStore((state) => state.mainGroupPosY);
  const mainGroupPosZ = useMainGroupStore((state) => state.mainGroupPosZ);
  const mainGroupRotX = useMainGroupStore((state) => state.mainGroupRotX);

  const mainGroupStatePos = useSpring({
    mainGroupPosY: mainGroupPosY,
    mainGroupPosZ: mainGroupPosZ,
    config: { duration: 3644 },
  });

  const mainGroupStateRot = useSpring({
    mainGroupRotX: mainGroupRotX,
    config: { duration: 1500 },
  });

  useEffect(() => {
    setLainMoveState("standing");
    setActiveBlueOrb("0422");
    setActiveBlueOrbHudId("fg_hud_1");
  }, [setActiveBlueOrb, setActiveBlueOrbHudId, setLainMoveState]);
  // set lain intro spritesheet before the page loads fully
  useEffect(() => {
    // setLainMoving(true);
    // setLainMoveState(<LainIntro />);
  }, [setLainMoveState]);

  return (
    <perspectiveCamera position-z={3}>
      <Suspense fallback={null}>
        <MainSceneIntro />
        <a.group
          rotation-x={mainGroupStateRot.mainGroupRotX}
          position-y={mainGroupStatePos.mainGroupPosY}
          position-z={mainGroupStatePos.mainGroupPosZ}
        >
          <EventStateManager />
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
