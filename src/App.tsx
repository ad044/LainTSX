import React, { Suspense, useEffect, useMemo } from "react";
import MainScene from "./scenes/MainScene";
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
import ChangeDiscScene from "./scenes/ChangeDiscScene";
import EndScene from "./scenes/EndScene";

const App = () => {
  const currentScene = useSceneStore((state) => state.currentScene);

  useEffect(() => {
    document.title = "< index >";
  }, []);

  const dispatchScene = useMemo(() => {
    return {
      main: <MainScene />,
      media: <MediaScene />,
      idle_media: <MediaScene />,
      gate: <GateScene />,
      boot: <BootScene />,
      sskn: <SSknScene />,
      polytan: <PolytanScene />,
      tak: <TaKScene />,
      change_disc: <ChangeDiscScene />,
      end: <EndScene />,
    };
  }, []);

  return (
    <div id="game-root" className="game">
      <span className="canvas">
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
