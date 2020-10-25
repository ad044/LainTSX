import React from "react";
import { useMediaStore } from "../store";
import TextRenderer from "../components/TextRenderer/TextRenderer";
import LeftSide from "../components/MediaScene/Selectables/LeftSide/LeftSide";
import RightSide from "../components/MediaScene/Selectables/RightSide/RightSide";
import AudioVisualizer from "../components/MediaScene/AudioVisualizer/AudioVisualizer";
import MediaLoadingBar from "../components/MediaScene/MediaLoadingBar";
import NodeNameContainer from "../components/MediaScene/NodeNameContainer";

const MediaScene = () => {
  const activeMediaElement = useMediaStore((state) => state.activeMediaElement);

  return (
    <group position={[0.4, -0.3, 0]}>
      <pointLight intensity={1.2} color={0xffffff} position={[-2, 0, 3]} />
      <LeftSide activeMediaElement={activeMediaElement} />
      <RightSide activeMediaElement={activeMediaElement} />
      <AudioVisualizer />
      <group position={[0, 0.5, 0]}>
        <MediaLoadingBar />
        <NodeNameContainer />
      </group>
      <group position={[0, 0, 13]} scale={[1, 1, 1]}>
        <TextRenderer />
      </group>
    </group>
  );
};

export default MediaScene;
