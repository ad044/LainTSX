import React, { useEffect, useState, Suspense, useMemo } from "react";
import MainScene from "./scenes/MainScene";
import "./static/css/main_scene.css";
import "./static/css/page.css";
import { Canvas } from "react-three-fiber";
import Boot from "./components/Boot";
import MediaPlayer from "./components/MediaScene/MediaPlayer";
import MediaScene from "./scenes/MediaScene";
import EventManager from "./components/StateManagers/EventManager";
import { useSceneStore } from "./store";

const App = () => {
  const [moveToGame, setMoveToGame] = useState(false);
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
    };
  }, []);

  return (
    <div id="game-root" className="game">
      {/*<Boot setMoveToGame={setMoveToGame} />*/}
      {/* {moveToGame ? <MainScene /> : <Boot setMoveToGame={setMoveToGame} />} */}
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
