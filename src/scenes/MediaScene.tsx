import React, { useCallback, useEffect, useMemo } from "react";
import { useMediaStore } from "../store";
import TextRenderer from "../components/TextRenderer/TextRenderer";
import LeftSide from "../components/MediaScene/Selectables/LeftSide";
import RightSide from "../components/MediaScene/Selectables/RightSide";
import AudioVisualizer from "../components/MediaScene/AudioVisualizer/AudioVisualizer";
import MediaLoadingBar from "../components/MediaScene/MediaLoadingBar";
import NodeNameContainer from "../components/MediaScene/NodeNameContainer";
import Lof from "../components/MediaScene/Lof";
import { OrbitControls } from "@react-three/drei";
import Images from "../components/MediaScene/Images";

const MediaScene = () => {
  const mediaComponentMatrixIndices = useMediaStore(
    (state) => state.componentMatrixIndices
  );

  const activeMediaComponent = useMediaStore(
    useCallback(
      (state) =>
        state.componentMatrix[mediaComponentMatrixIndices.sideIdx][
          mediaComponentMatrixIndices.sideIdx === 0
            ? mediaComponentMatrixIndices.leftSideIdx
            : mediaComponentMatrixIndices.rightSideIdx
        ],
      [mediaComponentMatrixIndices]
    )
  );

  useEffect(() => {
    document.getElementsByTagName("canvas")[0].className =
      "media-scene-background";
  }, []);

  return (
    <perspectiveCamera position-z={3}>
      <group position={[0.4, -0.3, 0]}>
        <OrbitControls />
        <pointLight intensity={1.2} color={0xffffff} position={[-2, 0, 0]} />
        <LeftSide activeMediaComponent={activeMediaComponent} />
        <RightSide activeMediaComponent={activeMediaComponent} />
        <AudioVisualizer />
        <group position={[0, 0.5, -3]}>
          <MediaLoadingBar />
          <NodeNameContainer />
        </group>
        <group position={[0, 0, 0]}>
          <TextRenderer />
        </group>
        <Lof />
        <Images />
      </group>
    </perspectiveCamera>
  );
};

export default MediaScene;
