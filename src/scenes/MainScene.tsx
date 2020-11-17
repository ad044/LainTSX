import { a, useSpring } from "@react-spring/three";
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
import {
  useNodeStore,
  useHudStore,
  useLainStore,
  useMainGroupStore,
} from "../store";
import TextRenderer from "../components/TextRenderer/TextRenderer";
import HUD from "../components/MainScene/HUD";
import YellowOrb from "../components/MainScene/YellowOrb";
import CurrentLevelNodes from "../components/MainScene/CurrentLevelNodes";

const MainScene = () => {
  const setLainMoveState = useLainStore((state) => state.setLainMoveState);
  const setActiveNode = useNodeStore((state) => state.setActiveNodeId);
  const setActiveNodeHudId = useHudStore(
    (state) => state.setActiveNodeHudId
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
    setActiveNode("0422");
    setActiveNodeHudId("fg_hud_1");
  }, [setActiveNode, setActiveNodeHudId, setLainMoveState]);
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
          <CurrentLevelNodes />
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
