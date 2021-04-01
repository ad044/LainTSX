import { useStore } from "../store";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import MainScene from "../scenes/MainScene";
import MediaScene from "../scenes/MediaScene";
import IdleMediaScene from "../scenes/IdleMediaScene";
import GateScene from "../scenes/GateScene";
import BootScene from "../scenes/BootScene";
import SsknScene from "../scenes/SsknScene";
import PolytanScene from "../scenes/PolytanScene";
import TaKScene from "../scenes/TaKScene";
import ChangeDiscScene from "../scenes/ChangeDiscScene";
import EndScene from "../scenes/EndScene";
import { Canvas } from "react-three-fiber";
import Preloader from "../components/Preloader";
import InputHandler from "../components/InputHandler";
import MediaPlayer from "../components/MediaPlayer";

const Game = () => {
  const currentScene = useStore((state) => state.currentScene);

  useEffect(() => {
    document.title = "< game >";
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

  const [width, setWidth] = useState((window.screen.height / 1.8) * 1.3);
  const [height, setHeight] = useState(window.screen.height / 1.8);

  const handleWindowKeypress = useCallback((event) => {
    switch (event.key) {
      case "l":
        const saveState = prompt(
          `This is your current save state. It's empty if you haven't saved the game yet. To export it, just copy this value and save it somewhere, to import another one, simply replace it and click ok. 
          \n If you wish to reset your progress, simply delete it and click ok.
          \n Keep in mind replacing this with something other than a save state/manually modifying it without being careful will result in a crash upon trying to load it.`,
          localStorage.getItem("lainSaveState") || undefined
        );

        localStorage.setItem("lainSaveState", saveState || "");

        break;
      case "k":
        setWidth((prevWidth) => prevWidth * 1.1);
        setHeight((prevHeight) => prevHeight * 1.1);
        break;
      case "j":
        setWidth((prevWidth) => prevWidth / 1.1);
        setHeight((prevHeight) => prevHeight / 1.1);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleWindowKeypress);

    return () => {
      window.removeEventListener("keydown", handleWindowKeypress);
    };
  }, [handleWindowKeypress]);

  useEffect(() => {
    document.body.style.overflowY = "hidden";

    return () => {
      document.body.style.overflowY = "visible";
    };
  }, []);

  return (
    <div
      className="game"
      style={{ width: Math.round(width), height: Math.round(height) }}
    >
      <Canvas
        concurrent
        gl={{ antialias: false }}
        pixelRatio={window.devicePixelRatio}
        className="main-canvas"
      >
        <Suspense fallback={null}>
          <Preloader />
          {dispatchScene[currentScene as keyof typeof dispatchScene]}
          <InputHandler />
        </Suspense>
      </Canvas>
      {["media", "idle_media", "tak", "end"].includes(currentScene) && (
        <div style={{ marginTop: -height }}>
          <MediaPlayer />
        </div>
      )}
    </div>
  );
};

export default Game;
