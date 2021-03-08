import React, { useEffect } from "react";
import "./static/css/page.css";
import Game from "./dom-components/Game";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Notes from "./dom-components/Notes";

const App = () => {
  useEffect(() => {
    document.title = "< index >";
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route path={"/"} exact component={Notes} />
        <Route path={"/game"} exact component={Game} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
