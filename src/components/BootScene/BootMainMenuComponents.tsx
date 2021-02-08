import React, { useCallback, useMemo } from "react";
import { a, useSpring } from "@react-spring/three";
import authorizeActive from "../../static/sprite/authorize_user_active.png";
import authorizeInactive from "../../static/sprite/authorize_user_inactive.png";
import loadDataActive from "../../static/sprite/load_data_active.png";
import loadDataInactive from "../../static/sprite/load_data_inactive.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import authorizeUserHeader from "../../static/sprite/authorize_user_scene_header.png";
import loadDataHeader from "../../static/sprite/load_data_header.png";
import { useStore } from "../../store";

type BootMainMenuProps = {
  visible: boolean;
  activeSubScene: string;
};

const BootMainMenuComponents = (props: BootMainMenuProps) => {
  const authorizeActiveTex = useLoader(THREE.TextureLoader, authorizeActive);
  const authorizeInactiveTex = useLoader(
    THREE.TextureLoader,
    authorizeInactive
  );
  const authorizeUserHeaderTex = useLoader(
    THREE.TextureLoader,
    authorizeUserHeader
  );

  const activeMainMenuElement = useStore(
    useCallback(
      (state) =>
        state.mainMenuComponentMatrix[state.mainMenuComponentMatrixIdx],
      []
    )
  );

  const loadDataActiveTex = useLoader(THREE.TextureLoader, loadDataActive);
  const loadDataInactiveTex = useLoader(THREE.TextureLoader, loadDataInactive);
  const loadDataHeaderTex = useLoader(THREE.TextureLoader, loadDataHeader);

  const loadDataTextState = useMemo(() => {
    if (props.activeSubScene === "load_data") {
      return {
        texture: loadDataHeaderTex,
        position: { x: -1.13, y: -1 },
      };
    } else {
      return {
        texture:
          activeMainMenuElement === "load_data"
            ? loadDataActiveTex
            : loadDataInactiveTex,
        position: { x: 0, y: -0.5 },
      };
    }
  }, [
    loadDataActiveTex,
    loadDataHeaderTex,
    loadDataInactiveTex,
    activeMainMenuElement,
    props.activeSubScene,
  ]);

  const authorizeUserTextState = useMemo(() => {
    if (props.activeSubScene === "authorize_user") {
      return {
        scale: [1.8, 0.16, 0],
        texture: authorizeUserHeaderTex,
        position: { x: 1.13, y: 1.2 },
      };
    } else {
      return {
        scale: [1.8, 0.3, 0],
        texture:
          activeMainMenuElement === "authorize_user"
            ? authorizeActiveTex
            : authorizeInactiveTex,
        position: { x: 0, y: 0.5 },
      };
    }
  }, [
    authorizeActiveTex,
    authorizeInactiveTex,
    authorizeUserHeaderTex,
    activeMainMenuElement,
    props.activeSubScene,
  ]);

  const mainMenuAnimationState = useSpring({
    authorizeUserOpacity: props.activeSubScene !== "load_data" ? 1 : 0,
    authorizeUserPosX: authorizeUserTextState.position.x,
    authorizeUserPosY: authorizeUserTextState.position.y,
    loadDataOpacity: props.activeSubScene !== "authorize_user" ? 1 : 0,
    loadDataPosX: loadDataTextState.position.x,
    loadDataPosY: loadDataTextState.position.y,
    config: { duration: 500 },
  });

  return (
    <>
      {props.visible && (
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
            scale={[1.4, 0.3, 0]}
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
      )}
    </>
  );
};

export default BootMainMenuComponents;
