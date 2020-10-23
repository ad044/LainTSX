import React from "react";
import { OrbitControls } from "drei";
import { useMediaStore } from "../../store";
import TextRenderer from "../TextRenderer/TextRenderer";
import LeftSide from "./LeftSide/LeftSide";
import RightSide from "./RightSide/RightSide";
import AudioVisualizer from "./AudioVisualizer/AudioVisualizer";

const MediaScene = () => {
  const activeMediaElement = useMediaStore((state) => state.activeMediaElement);

  return (
    <>
      <OrbitControls />
      <group position={[0.4, -0.3, 0]}>
        <group position={[0, 0, 13]} scale={[1, 1, 1]}>
          <TextRenderer />
        </group>

        <pointLight intensity={1.2} color={0xffffff} position={[-2, 0, 3]} />
        <LeftSide activeMediaElement={activeMediaElement} />
        <RightSide activeMediaElement={activeMediaElement} />
        <AudioVisualizer />
      </group>
    </>
  );
};

export default MediaScene;
