import React from "react";
import { a } from "@react-spring/three";
import authorizeActive from "../../static/sprite/authorize_user_active.png";
import authorizeInactive from "../../static/sprite/authorize_user_inactive.png";
import loadDataActive from "../../static/sprite/load_data_active.png";
import loadDataInactive from "../../static/sprite/load_data_inactive.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import { useMainMenuStore } from "../../store";

type BootMainMenuProps = {
  visible: boolean;
};

const BootMainMenu = (props: BootMainMenuProps) => {
  const activeMainMenuElement = useMainMenuStore(
    (state) => state.activeMainMenuElement
  );

  const authorizeActiveTex = useLoader(THREE.TextureLoader, authorizeActive);
  const authorizeInactiveTex = useLoader(
    THREE.TextureLoader,
    authorizeInactive
  );
  const loadDataActiveTex = useLoader(THREE.TextureLoader, loadDataActive);
  const loadDataInactiveTex = useLoader(THREE.TextureLoader, loadDataInactive);

  return (
    <>
      {props.visible ? (
        <>
          <a.sprite
            scale={[1.8, 0.3, 0]}
            renderOrder={1}
            position={[0, 0.5, 0]}
          >
            <spriteMaterial
              attach="material"
              map={
                activeMainMenuElement === "authorize_user"
                  ? authorizeActiveTex
                  : authorizeInactiveTex
              }
              transparent={true}
            />
          </a.sprite>

          <a.sprite
            scale={[1.4, 0.3, 0]}
            renderOrder={1}
            position={[0, -0.5, 0]}
          >
            <spriteMaterial
              attach="material"
              map={
                activeMainMenuElement === "load_data"
                  ? loadDataActiveTex
                  : loadDataInactiveTex
              }
              transparent={true}
            />
          </a.sprite>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default BootMainMenu;
