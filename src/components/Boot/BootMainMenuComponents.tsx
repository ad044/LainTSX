import React, { useMemo } from "react";
import { a, useSpring } from "@react-spring/three";
import authorizeActive from "../../static/sprite/authorize_user_active.png";
import authorizeInactive from "../../static/sprite/authorize_user_inactive.png";
import loadDataActive from "../../static/sprite/load_data_active.png";
import loadDataInactive from "../../static/sprite/load_data_inactive.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import { useBootStore } from "../../store";
import authorizeUserHeader from "../../static/sprite/authorize_user_scene_header.png";
import loadDataHeader from "../../static/sprite/load_data_header.png";

type BootMainMenuProps = {
  visible: boolean;
  activeSubScene: string;
};

const BootMainMenuComponents = (props: BootMainMenuProps) => {
  const activeMainMenuElement = useBootStore(
    (state) => state.activeMainMenuElement
  );
  const authorizeUserPos = useBootStore(
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
  const loadDataHeaderTex = useLoader(THREE.TextureLoader, loadDataHeader);

  const loadDataPos = useBootStore((state) => state.loadDataPos);

  const mainMenuAnimationState = useSpring({
    authorizeUserPosX: authorizeUserPos.x,
    authorizeUserPosY: authorizeUserPos.y,
    authorizeUserOpacity: props.activeSubScene !== "load_data" ? 1 : 0,
    loadDataOpacity: props.activeSubScene !== "authorize_user" ? 1 : 0,
    loadDataPosX: loadDataPos.x,
    loadDataPosY: loadDataPos.y,
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

  const loadDataTextState = useMemo(() => {
    if (props.activeSubScene === "load_data") {
      return { scale: [1.4, 0.16, 0], texture: loadDataHeaderTex };
    } else {
      return {
        scale: [1.4, 0.3, 0],
        texture:
          activeMainMenuElement === "load_data"
            ? loadDataActiveTex
            : loadDataInactiveTex,
      };
    }
  }, [
    activeMainMenuElement,
    loadDataActiveTex,
    loadDataHeaderTex,
    loadDataInactiveTex,
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
            <a.spriteMaterial
              attach="material"
              map={authorizeUserTextState.texture}
              transparent={true}
              opacity={mainMenuAnimationState.authorizeUserOpacity}
            />
          </a.sprite>

          <a.sprite
            scale={loadDataTextState.scale as [number, number, number]}
            renderOrder={1}
            position-x={mainMenuAnimationState.loadDataPosX}
            position-y={mainMenuAnimationState.loadDataPosY}
          >
            <a.spriteMaterial
              attach="material"
              map={loadDataTextState.texture}
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
