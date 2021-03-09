import React, { useEffect } from "react";
import "./static/css/page.css";
import Game from "./dom-components/Game";
import { HashRouter, Route, Switch } from "react-router-dom";
import Notes from "./dom-components/Notes";

const App = () => {
  useEffect(() => {
    document.title = "< index >";
  }, []);

  return (
    <HashRouter>
      <Switch>
        <Route path={"/"} exact component={Notes} />
        <Route path={"/game"} exact component={Game} />
      </Switch>
    </HashRouter>
  );
};

export default App;
