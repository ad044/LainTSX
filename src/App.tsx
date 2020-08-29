import React, { useEffect, useState, Suspense } from "react";
import Intro from "./components/Intro";
import Game from "./components/Game";
import "./static/css/main.css";
import "./static/css/hub.css";

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
      {/* {moveToGame ? <Game /> : <Intro setMoveToGame={setMoveToGame} />} */}
      {/* <Intro /> */}
        <Game />
    </div>
  );
};

export default App;
