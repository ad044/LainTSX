import React, { useCallback, useEffect, useState } from "react";
import BootAccela from "../components/Boot/BootAccela";
import BootAnimation from "../components/Boot/BootAnimation";
import BootMainMenuComponents from "../components/Boot/BootMainMenuComponents";
import { useBootStore } from "../store";
import BootAuthorizeUser from "../components/Boot/BootAuthorizeUser";
import BootLoadData from "../components/Boot/BootLoadData";

const BootScene = () => {
  const activeSubscene = useBootStore((state) => state.subscene);
  const activeBootElement = useBootStore(
    useCallback(
      (state) =>
        state.componentMatrix[
          activeSubscene as keyof typeof state.componentMatrix
        ][
          state.componentMatrixIndices[
            activeSubscene as keyof typeof state.componentMatrixIndices
          ]
        ],
      [activeSubscene]
    )
  );

  const [accelaVisible, setAccelaVisible] = useState(true);
  const [mainMenuVisible, setMainMenuVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAccelaVisible(false);
      // 2000
    }, 2000);
    setTimeout(() => {
      setMainMenuVisible(true);
      //6200
    }, 6200);
  }, []);

  return (
    <perspectiveCamera position-z={3}>
      <BootAccela visible={accelaVisible} />
      <BootAnimation visible={!accelaVisible} activeSubScene={activeSubscene} />
      <BootMainMenuComponents
        visible={mainMenuVisible}
        activeSubScene={activeSubscene}
        activeBootElement={activeBootElement}
      />
      <BootAuthorizeUser visible={activeSubscene === "authorize_user"} />
      <BootLoadData
        visible={activeSubscene === "load_data"}
        activeBootElement={activeBootElement}
      />
    </perspectiveCamera>
  );
};
export default BootScene;
