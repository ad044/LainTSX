import { OrbitControls } from "@react-three/drei";
import React, { Suspense, useEffect, useMemo } from "react";
import Lain from "../components/MainScene/Lain";
import Preloader from "../components/Preloader";
import { useStore } from "../store";
import Pause from "../components/MainScene/PauseSubscene/Pause";
import SyncedComponentLoader from "../components/MainScene/SyncedComponentLoader";
import LevelSelection from "../components/MainScene/SyncedComponents/LevelSelection";

const MainScene = () => {
  const currentSubscene = useStore((state) => state.mainSubscene);
  const shouldIntro = useStore((state) => state.intro);

  const isPaused = useMemo(() => currentSubscene === "pause", [
    currentSubscene,
  ]);

  useEffect(() => {
    return () => {
      document.getElementsByTagName("canvas")[0].className = "";
    };
  }, []);
  return (
    <perspectiveCamera position-z={3}>
      <Suspense fallback={null}>
        <Preloader />
        <LevelSelection />
        <Pause paused={isPaused} />
        <SyncedComponentLoader paused={isPaused} shouldIntro={shouldIntro} />
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
