import React from "react";
import SSknIcon from "../components/SSknScene/SSknIcon";
import SSknBackground from "../components/SSknScene/SSknBackground";
import SSknHUD from "../components/SSknScene/SSknHUD";

const SSknScene = () => {
  return (
    <>
      <SSknBackground />
      <SSknIcon />
      <SSknHUD />
    </>
  );
};

export default SSknScene;
