import React from "react";
import BootAccela from "../components/Boot/BootAccela";
import BootAnimation from "../components/Boot/BootAnimation";

const BootScene = () => {
  return (
    <perspectiveCamera position-z={3}>
      {/*<BootAccela />*/}
      <BootAnimation />
    </perspectiveCamera>
  );
};
export default BootScene;
