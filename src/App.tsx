import React from "react";
import "./static/css/page.css";
import Game from "./dom-components/Game";
import { HashRouter, Route, Switch } from "react-router-dom";
import Notes from "./dom-components/Notes";
import MainPage from "./dom-components/MainPage";
import Guide from "./dom-components/Guide";

const App = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path={"/"} exact component={MainPage} />
        <Route path={"/notes"} exact component={Notes} />
        <Route path={"/game"} exact component={Game} />
        <Route path={"/guide"} exact component={Guide} />
      </Switch>
    </HashRouter>
  );
};

export default App;
