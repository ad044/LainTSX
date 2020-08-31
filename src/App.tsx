import React, { useEffect, useState } from "react";
import Game from "./components/Game";
import "./static/css/hub.css";
import "./static/css/main.css";

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
