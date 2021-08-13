import React, { useEffect } from "react";
import Header from "./Header";
import Keybinding from "./Keybinding";
import Language from "./Language";
import Savefile from "./Savefile";

const Options = () => {
  useEffect(() => {
    document.title = "< options >";
  }, []);

  return (
    <>
      <Header />
      <Language />
      <hr />
      <Keybinding />
      <hr />
      <Savefile />
    </>
  );
};

export default Options;
