import React, { Suspense, useEffect, useMemo } from "react";
import MainScene from "./scenes/MainScene";
import "./static/css/page.css";
import { Canvas } from "react-three-fiber";
import MediaPlayer from "./components/MediaPlayer";
import MediaScene from "./scenes/MediaScene";
import { useStore } from "./store";
import GateScene from "./scenes/GateScene";
import BootScene from "./scenes/BootScene";
import SsknScene from "./scenes/SsknScene";
import PolytanScene from "./scenes/PolytanScene";
import TaKScene from "./scenes/TaKScene";
import ChangeDiscScene from "./scenes/ChangeDiscScene";
import EndScene from "./scenes/EndScene";
import IdleMediaScene from "./scenes/IdleMediaScene";
import InputHandler from "./components/InputHandler";

const App = () => {
  const currentScene = useStore((state) => state.currentScene);

  useEffect(() => {
    document.title = "< index >";
  }, []);

  const dispatchScene = useMemo(
    () => ({
      main: <MainScene />,
      media: <MediaScene />,
      idle_media: <IdleMediaScene />,
      gate: <GateScene />,
      boot: <BootScene />,
      sskn: <SsknScene />,
      polytan: <PolytanScene />,
      tak: <TaKScene />,
      change_disc: <ChangeDiscScene />,
      end: <EndScene />,
      null: <></>,
    }),
    []
  );

  return (
    <div className="game">
      <Canvas
        concurrent
        gl={{ antialias: false }}
        pixelRatio={window.devicePixelRatio}
        className="main-canvas"
      >
        <Suspense fallback={null}>
          {/*<Preloader />*/}
          {dispatchScene[currentScene as keyof typeof dispatchScene]}
          <InputHandler />
        </Suspense>
      </Canvas>
      {["media", "idle_media", "tak", "end"].includes(currentScene) && (
        <MediaPlayer />
      )}
    </div>
  );
};

export default App;
