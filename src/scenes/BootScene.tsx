import React, { useEffect, useState } from "react";
import BootAccela from "../components/BootScene/BootAccela";
import BootAnimation from "../components/BootScene/BootAnimation";
import BootMainMenuComponents from "../components/BootScene/BootMainMenuComponents";
import { useStore } from "../store";
import BootAuthorizeUser from "../components/BootScene/BootAuthorizeUser";
import BootLoadData from "../components/BootScene/BootLoadData";

const BootScene = () => {
  const activeSubscene = useStore((state) => state.bootSubscene);

  const [accelaVisible, setAccelaVisible] = useState(true);
  const [mainMenuVisible, setMainMenuVisible] = useState(false);

  const setInputCooldown = useStore((state) => state.setInputCooldown);

  useEffect(() => {
    setInputCooldown(-1);
    setTimeout(() => setAccelaVisible(false), 2000);
    setTimeout(() => setMainMenuVisible(true), 6200);
    setTimeout(() => setInputCooldown(0), 6500);
  }, [setInputCooldown]);

  return (
    <group position-z={3}>
      <BootAccela visible={accelaVisible} />
      <BootAnimation
        visible={!accelaVisible}
        activeSubScene={activeSubscene}
        mainMenuVisible={mainMenuVisible}
      />
      <BootMainMenuComponents
        visible={mainMenuVisible}
        activeSubScene={activeSubscene}
      />
      <BootAuthorizeUser visible={activeSubscene === "authorize_user"} />
      <BootLoadData visible={activeSubscene === "load_data"} />
    </group>
  );
};
export default BootScene;
