import React, { useEffect } from "react";
import "./static/css/page.css";
import Game from "./dom-components/Game";
import { HashRouter, Route, Switch } from "react-router-dom";
import Notes from "./dom-components/Notes";
import MainPage from "./dom-components/MainPage";
import Guide from "./dom-components/Guide";
import Options from "./dom-components/Options";
import { useStore } from "./store";

const App = () => {
  const setKeybindings = useStore((state) => state.setKeybindings);
  const setLanguage = useStore((state) => state.setLanguage);

  useEffect(() => {
    const keybindingSettings = localStorage.getItem("lainKeybindings");
    const language = localStorage.getItem("lainLanguage");
    if (keybindingSettings) setKeybindings(JSON.parse(keybindingSettings));
    if (language) setLanguage(JSON.parse(language));
  }, [setKeybindings, setLanguage]);

  return (
    <HashRouter>
      <Switch>
        <Route path={"/"} exact component={MainPage} />
        <Route path={"/notes"} exact component={Notes} />
        <Route path={"/game"} exact component={Game} />
        <Route path={"/guide"} exact component={Guide} />
        <Route path={"/options"} exact component={Options} />
      </Switch>
    </HashRouter>
  );
};

export default App;
