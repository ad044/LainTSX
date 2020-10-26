import { a, useSpring } from "@react-spring/three";
import { OrbitControls } from "drei";
import React, { Suspense, useEffect } from "react";
import Site from "../components/MainScene/Site";
import Lain from "../components/MainScene/Lain";
import Lights from "../components/MainScene/Lights";
import Preloader from "../components/Preloader";
import MainSceneIntro from "../components/MainSceneIntro";
import GrayPlanes from "../components/MainScene/GrayPlanes";
import MiddleRing from "../components/MainScene/MiddleRing";
import Starfield from "../components/MainScene/Starfield";
import { useBlueOrbStore, useLainStore, useMainGroupStore } from "../store";
import TextRenderer from "../components/TextRenderer/TextRenderer";
import HUD from "../components/MainScene/HUD";
import YellowOrb from "../components/MainScene/YellowOrb";

const MainScene = () => {
  const setLainMoveState = useLainStore((state) => state.setLainMoveState);
  const setActiveBlueOrb = useBlueOrbStore((state) => state.setActiveBlueOrbId);
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

  return (
    <perspectiveCamera position-z={3}>
      <Suspense fallback={null}>
        <MainSceneIntro />
        <a.group
          rotation-x={mainGroupStateRot.mainGroupRotX}
          position-y={mainGroupStatePos.mainGroupPosY}
          position-z={mainGroupStatePos.mainGroupPosZ}
        >
          <Preloader />
          <Site />
          <HUD />
          <TextRenderer />
          <YellowOrb />
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
