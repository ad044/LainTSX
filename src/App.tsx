import React, { useEffect, useState, Suspense } from "react";
import MainScene from "./components/MainScene";
import "./static/css/hub.css";
import "./static/css/main.css";
import { Canvas } from "react-three-fiber";
import Boot from "./components/Boot";
import MediaPlayer from "./components/MediaPlayer";
import MediaOverlay from "./components/MediaOverlay";
import EventStateManager from "./components/StateManagers/EventStateManager";

const App = () => {
  const [moveToGame, setMoveToGame] = useState(false);

  useEffect(() => {
    document.title = "< index >";
    document.getElementsByTagName("body")[0].className = "main-body";
    return () => {
      document.getElementsByTagName("body")[0].className = "";
    };
  }, []);

  return (
    <div id="game-root" className="game">
      {/*<Boot setMoveToGame={setMoveToGame} />*/}
      {/* {moveToGame ? <MainScene /> : <Boot setMoveToGame={setMoveToGame} />} */}
      <span className="canvas">
        <EventStateManager />
        <Canvas concurrent>
          <Suspense fallback={null}>
            <MediaOverlay />
          </Suspense>
          {/*<MainScene />*/}
        </Canvas>
      </span>
      <MediaPlayer />
    </div>
  );
};

export default App;
