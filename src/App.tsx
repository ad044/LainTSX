import React, { useEffect } from "react";
import "./static/css/page.css";
import Game from "./dom-components/Game";
import { HashRouter, Route, Switch } from "react-router-dom";
import Notes from "./dom-components/Notes";
import MainPage from "./dom-components/MainPage";
import Guide from "./dom-components/Guide";
import Keybinding from "./dom-components/Keybinding";
import { useStore } from "./store";
import Savefile from "./dom-components/Savefile";

const App = () => {
  const setKeybindings = useStore((state) => state.setKeybindings);

  useEffect(() => {
    const keybindingSettings = localStorage.getItem("lainKeybindings");
    if (keybindingSettings) setKeybindings(JSON.parse(keybindingSettings));
  }, [setKeybindings]);

  return (
    <HashRouter>
      <Switch>
        <Route path={"/"} exact component={MainPage} />
        <Route path={"/notes"} exact component={Notes} />
        <Route path={"/game"} exact component={Game} />
        <Route path={"/guide"} exact component={Guide} />
        <Route path={"/keybinding"} exact component={Keybinding} />
        <Route path={"/savefile"} exact component={Savefile} />
      </Switch>
    </HashRouter>
  );
};

export default App;
