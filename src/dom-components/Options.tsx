import React, { useEffect } from "react";
import Header from "./Header";
import Keybinding from "./Keybinding";
import Savefile from "./Savefile";

const Options = () => {
  useEffect(() => {
    document.title = "< options >";
  }, []);

  return (
    <>
      <Header />
      <Keybinding />
      <hr />
      <Savefile />
    </>
  );
};

export default Options;
