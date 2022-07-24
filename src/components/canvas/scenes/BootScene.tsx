import React, { useEffect, useState } from "react";
import BootAccela from "@canvas/objects/BootScene/BootAccela";
import BootAnimation from "@canvas/objects/BootScene/BootAnimation";
import BootMainMenuComponents from "@canvas/objects/BootScene/BootMainMenuComponents";
import { useStore } from "@/store";
import BootAuthorizeUser from "@canvas/objects/BootScene/BootAuthorizeUser";
import BootLoadData from "@canvas/objects/BootScene/BootLoadData";
import { BootSubscene } from "@/types";
import { handleEvent } from "@/core";
import { setInputCooldown } from "@/core/events";

const BootScene = () => {
  const bootSubscene = useStore((state) => state.bootSubscene);

  const [accelaVisible, setAccelaVisible] = useState(true);
  const [mainMenuVisible, setMainMenuVisible] = useState(false);

  useEffect(() => {
    handleEvent(setInputCooldown(-1));
    setTimeout(() => setAccelaVisible(false), 2000);
    setTimeout(() => setMainMenuVisible(true), 6200);
    setTimeout(() => handleEvent(setInputCooldown(0)), 6500);
  }, []);

  return (
    <group position-z={3}>
      <BootAccela visible={accelaVisible} />
      <BootAnimation
        visible={!accelaVisible}
        mainMenuVisible={mainMenuVisible}
      />
      <BootMainMenuComponents visible={mainMenuVisible} />
      <BootAuthorizeUser
        visible={bootSubscene === BootSubscene.AuthorizeUser}
      />
      <BootLoadData visible={bootSubscene === BootSubscene.LoadData} />
    </group>
  );
};
export default BootScene;
