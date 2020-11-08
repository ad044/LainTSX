import React, { useEffect, useState } from "react";
import BootAccela from "../components/Boot/BootAccela";
import BootAnimation from "../components/Boot/BootAnimation";
import BootMainMenu from "../components/Boot/BootMainMenu";

const BootScene = () => {
  const [accelaVisible, setAccelaVisible] = useState(true);
  const [mainMenuVisible, setMainMenuVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAccelaVisible(false);
    }, 2000);
    setTimeout(() => {
      setMainMenuVisible(true);
    }, 6200);
  }, []);

  return (
    <perspectiveCamera position-z={3}>
      <BootAccela visible={accelaVisible} />
      <BootAnimation visible={!accelaVisible} />
      <BootMainMenu visible={mainMenuVisible} />
    </perspectiveCamera>
  );
};
export default BootScene;
