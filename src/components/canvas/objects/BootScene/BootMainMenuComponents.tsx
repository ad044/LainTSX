import React, { useMemo } from "react";
import { a, useSpring } from "@react-spring/three";
import { useStore } from "@/store";
import { BootSubscene, MainMenuComponent, Position } from "@/types";
import { useTexture } from "@react-three/drei";
import { sRGBEncoding } from "three";

type BootMainMenuProps = {
  visible: boolean;
};

type MainMenuComponentSpring = {
  opacity: number;
  position: Position;
};

const BootMainMenuComponents = (props: BootMainMenuProps) => {
  const bootSubscene = useStore((state) => state.bootSubscene);

  const authorizeUserActive = useTexture(
    "/sprites/boot/authorize_user_active.png"
  );
  const authorizeUserInactive = useTexture(
    "/sprites/boot/authorize_user_inactive.png"
  );
  const authorizeUserHeader = useTexture(
    "/sprites/boot/authorize_user_scene_header.png"
  );

  const loadDataActive = useTexture("/sprites/boot/load_data_active.png");
  const loadDataInactive = useTexture("/sprites/boot/load_data_inactive.png");
  const loadDataHeader = useTexture("/sprites/boot/load_data_header.png");

  const activeMainMenuElement = useStore(
    (state) => state.mainMenuComponent
  );

  const loadDataTexture = useMemo(() => {
    if (bootSubscene === BootSubscene.LoadData) {
      return loadDataHeader;
    }
    if (activeMainMenuElement === MainMenuComponent.LoadData) {
      return loadDataActive;
    }

    return loadDataInactive;
  }, [
    activeMainMenuElement,
    bootSubscene,
    loadDataActive,
    loadDataHeader,
    loadDataInactive,
  ]);

  const authorizeUserTexture = useMemo(() => {
    if (bootSubscene === BootSubscene.AuthorizeUser) {
      return authorizeUserHeader;
    }
    if (activeMainMenuElement === MainMenuComponent.AuthorizeUser) {
      return authorizeUserActive;
    }

    return authorizeUserInactive;
  }, [
    activeMainMenuElement,
    authorizeUserActive,
    authorizeUserInactive,
    authorizeUserHeader,
    bootSubscene,
  ]);

  const loadDataSpring = useSpring<MainMenuComponentSpring>({
    opacity: bootSubscene !== BootSubscene.AuthorizeUser ? 1 : 0,
    position:
      bootSubscene === BootSubscene.LoadData ? [-1.13, -1, 0] : [0, -0.5, 0],
    config: { duration: 500 },
  });

  const authorizeUserSpring = useSpring<MainMenuComponentSpring>({
    opacity: bootSubscene !== BootSubscene.LoadData ? 1 : 0,
    position:
      bootSubscene === BootSubscene.AuthorizeUser
        ? [1.13, 1.2, 0]
        : [0, 0.5, 0],
    config: { duration: 500 },
  });

  return (
    <>
      {props.visible && (
        <>
          <a.sprite
            scale={
              bootSubscene === BootSubscene.AuthorizeUser
                ? [1.8, 0.16, 0]
                : [1.8, 0.3, 0]
            }
            renderOrder={1}
            position={authorizeUserSpring.position}
          >
            {/* @ts-ignore: https://github.com/pmndrs/react-spring/issues/1515 */}
            <a.spriteMaterial
              map={authorizeUserTexture}
              transparent={true}
              opacity={authorizeUserSpring.opacity}
            />
          </a.sprite>

          <a.sprite
            scale={[1.4, 0.3, 0]}
            renderOrder={1}
            position={loadDataSpring.position}
          >
            <a.spriteMaterial
              map={loadDataTexture}
              transparent={true}
              opacity={loadDataSpring.opacity}
            />
          </a.sprite>
        </>
      )}
    </>
  );
};

export default BootMainMenuComponents;
