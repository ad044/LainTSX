import { OrbitControls } from "@react-three/drei";
import React, { Suspense, useEffect, useState } from "react";
import { useStore } from "../store";
import Pause from "../components/MainScene/PauseSubscene/Pause";
import LevelSelection from "../components/MainScene/SyncedComponents/LevelSelection";
import HUD from "../components/MainScene/SyncedComponents/HUD";
import YellowTextRenderer from "../components/TextRenderer/YellowTextRenderer";
import YellowOrb from "../components/MainScene/SyncedComponents/YellowOrb";
import MiddleRing from "../components/MainScene/SyncedComponents/MiddleRing";
import GrayPlanes from "../components/MainScene/SyncedComponents/GrayPlanes";
import Starfield from "../components/MainScene/SyncedComponents/Starfield";
import Site from "../components/MainScene/SyncedComponents/Site";
import Lain from "../components/MainScene/Lain";

const MainScene = () => {
  const [paused, setPaused] = useState(false);
  const subscene = useStore((state) => state.mainSubscene);

  const wordSelected = useStore((state) => state.wordSelected);
  const setWordSelected = useStore((state) => state.setWordSelected);

  useEffect(() => {
    if (subscene === "pause") {
      setTimeout(() => {
        setPaused(true);
      }, 3400);
    } else {
      setPaused(false);
    }
  }, [subscene]);

  useEffect(() => {
    if (wordSelected) {
      setTimeout(() => {
        setWordSelected(false);
      }, 3100);
    }
  }, [setWordSelected, wordSelected]);

  return (
    <perspectiveCamera position-z={3}>
      <Suspense fallback={null}>
        <LevelSelection />
        <Pause />
        <group visible={!paused}>
          <group visible={!wordSelected}>
            <HUD />
            <YellowTextRenderer />
            <MiddleRing />
            <GrayPlanes />
            <Lain shouldIntro={false} />
          </group>
          <YellowOrb visible={!paused} />
          <Starfield shouldIntro={false} introFinished={true} />
        </group>
        <Site shouldIntro={false} introFinished={true} />
        <OrbitControls />
        <pointLight color={0xffffff} position={[0, 0, 7]} intensity={1} />
        <pointLight color={0x7f7f7f} position={[0, 10, 0]} intensity={1.5} />
        <pointLight color={0xffffff} position={[8, 0, 0]} intensity={0.2} />
        <pointLight color={0xffffff} position={[-8, 0, 0]} intensity={0.2} />
      </Suspense>
    </perspectiveCamera>
  );
};
export default MainScene;
