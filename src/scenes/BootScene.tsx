import React, { useEffect, useState } from "react";
import BootAccela from "../components/Boot/BootAccela";
import BootAnimation from "../components/Boot/BootAnimation";
import BootMainMenuComponents from "../components/Boot/BootMainMenuComponents";
import { useBootStore } from "../store";
import BootAuthorizeUser from "../components/Boot/BootAuthorizeUser";

const BootScene = () => {
  const activeBootSubScene = useBootStore((state) => state.activeBootSubScene);

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
        activeSubScene={activeBootSubScene}
      />
      <BootMainMenuComponents
        visible={mainMenuVisible}
        activeSubScene={activeBootSubScene}
      />
      <BootAuthorizeUser visible={activeBootSubScene === "authorize_user"} />
    </perspectiveCamera>
  );
};
export default BootScene;
