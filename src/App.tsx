import React, { useEffect, useState, Suspense, useMemo } from "react";
import MainScene from "./scenes/MainScene";
import "./static/css/main_scene.css";
import "./static/css/page.css";
import { Canvas } from "react-three-fiber";
import MediaPlayer from "./components/MediaScene/MediaPlayer";
import MediaScene from "./scenes/MediaScene";
import EventManager from "./core/StateManagers/EventManager";
import { useSceneStore } from "./store";
import GateScene from "./scenes/GateScene";
import BootScene from "./scenes/BootScene";
import SSknScene from "./scenes/SSknScene";
import PolytanScene from "./scenes/PolytanScene";
import TaKScene from "./scenes/TaKScene";

const App = () => {
  const currentScene = useSceneStore((state) => state.currentScene);
  useEffect(() => {
    document.title = "< index >";
    document.getElementsByTagName("body")[0].className = "main-body";
    return () => {
      document.getElementsByTagName("body")[0].className = "";
    };
  }, []);

  const dispatchScene = useMemo(() => {
    return {
      main: <MainScene />,
      media: <MediaScene />,
      gate: <GateScene />,
      boot: <BootScene />,
      sskn: <SSknScene />,
      polytan: <PolytanScene />,
      tak: <TaKScene />,
    };
  }, []);

  return (
    <div id="game-root" className="game">
      <span className="canvas">
        <EventManager />
        <Canvas concurrent>
          <Suspense fallback={null}>
            {dispatchScene[currentScene as keyof typeof dispatchScene]}
          </Suspense>
        </Canvas>
      </span>
      <MediaPlayer />
    </div>
  );
};

export default App;
