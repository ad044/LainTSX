import React from "react";
import loadDataUnderline from "../../static/sprites/boot/load_data_header_underline.png";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import Prompt from "../Prompt";
import { useStore } from "../../store";
import Status from "../Status";

type BootLoadDataProps = {
  visible: boolean;
};

const BootLoadData = (props: BootLoadDataProps) => {
  const promptVisible = useStore((state) => state.promptVisible);

  const loadDataUnderlineTex = useLoader(
    THREE.TextureLoader,
    loadDataUnderline
  );

  return (
    <>
      {props.visible && (
        <>
          <sprite
            scale={[3.5, 0.01, 0]}
            position={[-0.5, -1.15, 0]}
            renderOrder={2}
          >
            <spriteMaterial
              map={loadDataUnderlineTex}
              attach="material"
              transparent={true}
            />
          </sprite>
          <group visible={promptVisible}>
            <Prompt />
          </group>
          <group position={[-0.8, -0.8, 0]} scale={[0.8, 0.6, 0]}>
            <Status />
          </group>
        </>
      )}
    </>
  );
};

export default BootLoadData;
