import React, { useEffect, useState } from "react";
import BootAccela from "../components/Boot/BootAccela";
import BootAnimation from "../components/Boot/BootAnimation";
import BootMainMenuComponents from "../components/Boot/BootMainMenuComponents";
import { useSubsceneStore } from "../store";
import BootAuthorizeUser from "../components/Boot/BootAuthorizeUser";
import BootLoadData from "../components/Boot/BootLoadData";

const BootScene = () => {
  const activeSubscene = useSubsceneStore((state) => state.activeSubscene);

  const [accelaVisible, setAccelaVisible] = useState(true);
  const [mainMenuVisible, setMainMenuVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAccelaVisible(false);
      // 2000
    }, 0);
    setTimeout(() => {
      setMainMenuVisible(true);
      //6200
    }, 0);
  }, []);

  return (
    <perspectiveCamera position-z={3}>
      <BootAccela visible={accelaVisible} />
      <BootAnimation
        visible={!accelaVisible}
        activeSubScene={activeSubscene}
      />
      <BootMainMenuComponents
        visible={mainMenuVisible}
        activeSubScene={activeSubscene}
      />
      <BootAuthorizeUser visible={activeSubscene === "authorize_user"} />
      <BootLoadData visible={activeSubscene === "load_data"} />
    </perspectiveCamera>
  );
};
export default BootScene;
