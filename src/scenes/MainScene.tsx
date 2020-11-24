import { a } from "@react-spring/three";
import { OrbitControls } from "@react-three/drei";
import React, { Suspense, useEffect } from "react";
import Site from "../components/MainScene/Site";
import Lain from "../components/MainScene/Lain";
import Lights from "../components/MainScene/Lights";
import Preloader from "../components/Preloader";
import MainSceneIntro from "../components/MainSceneIntro";
import GrayPlanes from "../components/MainScene/GrayPlanes";
import MiddleRing from "../components/MainScene/MiddleRing";
import Starfield from "../components/MainScene/Starfield";
import { useHudStore, useLainStore } from "../store";
import TextRenderer from "../components/TextRenderer/GreenTextRenderer";
import HUD from "../components/MainScene/HUD";
import YellowOrb from "../components/MainScene/YellowOrb";
import ActiveLevelNodes from "../components/MainScene/ActiveLevelNodes";
import YellowTextRenderer from "../components/TextRenderer/YellowTextRenderer";

const MainScene = () => {
  const setLainMoveState = useLainStore((state) => state.setLainMoveState);
  const setActiveNodeHudId = useHudStore((state) => state.setId);

  useEffect(() => {
    setLainMoveState("standing");
    setActiveNodeHudId("fg_hud_1");
  }, [setActiveNodeHudId, setLainMoveState]);

  return (
    <perspectiveCamera position-z={3}>
      <Suspense fallback={null}>
        <MainSceneIntro />
        <a.group>
          <Preloader />
          <Site />
          <ActiveLevelNodes />
          <HUD />
          <TextRenderer />
          <YellowTextRenderer />
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
