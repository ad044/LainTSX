import React, { useMemo } from "react";
import { a, useSpring } from "@react-spring/three";
import authorizeActive from "../../static/sprite/authorize_user_active.png";
import authorizeInactive from "../../static/sprite/authorize_user_inactive.png";
import loadDataActive from "../../static/sprite/load_data_active.png";
import loadDataInactive from "../../static/sprite/load_data_inactive.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import { useBootMainMenuStore } from "../../store";
import authorizeUserHeader from "../../static/sprite/authorize_user_scene_header.png";

type BootMainMenuProps = {
  visible: boolean;
  activeSubScene: string;
};

const BootMainMenuComponents = (props: BootMainMenuProps) => {
  const activeMainMenuElement = useBootMainMenuStore(
    (state) => state.activeMainMenuElement
  );
  const authorizeUserPos = useBootMainMenuStore(
    (state) => state.authorizeUserPos
  );

  const authorizeActiveTex = useLoader(THREE.TextureLoader, authorizeActive);
  const authorizeInactiveTex = useLoader(
    THREE.TextureLoader,
    authorizeInactive
  );
  const authorizeUserHeaderTex = useLoader(
    THREE.TextureLoader,
    authorizeUserHeader
  );

  const loadDataActiveTex = useLoader(THREE.TextureLoader, loadDataActive);
  const loadDataInactiveTex = useLoader(THREE.TextureLoader, loadDataInactive);

  const mainMenuAnimationState = useSpring({
    authorizeUserPosX: authorizeUserPos.x,
    authorizeUserPosY: authorizeUserPos.y,
    loadDataOpacity: props.activeSubScene === "main_menu" ? 1 : 0,
    config: { duration: 500 },
  });

  const authorizeUserTextState = useMemo(() => {
    if (props.activeSubScene === "authorize_user") {
      return { scale: [1.8, 0.16, 0], texture: authorizeUserHeaderTex };
    } else {
      return {
        scale: [1.8, 0.3, 0],
        texture:
          activeMainMenuElement === "authorize_user"
            ? authorizeActiveTex
            : authorizeInactiveTex,
      };
    }
  }, [
    activeMainMenuElement,
    authorizeActiveTex,
    authorizeInactiveTex,
    authorizeUserHeaderTex,
    props.activeSubScene,
  ]);

  return (
    <>
      {props.visible ? (
        <>
          <a.sprite
            scale={authorizeUserTextState.scale as [number, number, number]}
            renderOrder={1}
            position-x={mainMenuAnimationState.authorizeUserPosX}
            position-y={mainMenuAnimationState.authorizeUserPosY}
          >
            <spriteMaterial
              attach="material"
              map={authorizeUserTextState.texture}
              transparent={true}
            />
          </a.sprite>

          <a.sprite
            scale={[1.4, 0.3, 0]}
            renderOrder={1}
            position={[0, -0.5, 0]}
          >
            <a.spriteMaterial
              attach="material"
              map={
                activeMainMenuElement === "load_data"
                  ? loadDataActiveTex
                  : loadDataInactiveTex
              }
              transparent={true}
              opacity={mainMenuAnimationState.loadDataOpacity}
            />
          </a.sprite>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default BootMainMenuComponents;
