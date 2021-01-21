import React, { useCallback, useEffect } from "react";
import { useMainSceneStore, useMediaStore } from "../store";
import LeftSide from "../components/MediaScene/Selectables/LeftSide";
import RightSide from "../components/MediaScene/Selectables/RightSide";
import AudioVisualizer from "../components/MediaScene/AudioVisualizer/AudioVisualizer";
import MediaLoadingBar from "../components/MediaScene/MediaLoadingBar";
import NodeNameContainer from "../components/MediaScene/NodeNameContainer";
import Lof from "../components/MediaScene/Lof";
import Images from "../components/MediaScene/Images";
import MediumLetter from "../components/TextRenderer/MediumLetter";
import MediaYellowTextAnimator from "../components/TextRenderer/MediaYellowTextAnimator";
import MediaSceneEventManager from "../core/StateManagers/MediaSceneEventManager";

const MediaScene = () => {
  const mediaComponentMatrixIndices = useMediaStore(
    (state) => state.componentMatrixIndices
  );

  const activeNodeName = useMainSceneStore((state) =>
    state.activeNode.node_name.split("")
  );
  const activeNodeMedia = useMainSceneStore(
    (state) => state.activeNode.media_file
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

    return () => {
      document.getElementsByTagName("canvas")[0].className = "";
    };
  }, []);

  return (
    <perspectiveCamera position-z={3}>
      <group position={[0.4, -0.3, 0]}>
        <pointLight intensity={1.2} color={0xffffff} position={[-2, 0, 0]} />
        <LeftSide activeMediaComponent={activeMediaComponent} />
        <group position={[0, 0.5, -3]}>
          <MediaLoadingBar />
          <NodeNameContainer />
        </group>
        <group scale={[0.06, 0.12, 0]} position={[0.8, 1.37, 0]}>
          {activeNodeName.map((letter: string, idx: number) => (
            <MediumLetter letter={letter} letterIdx={idx} key={idx} />
          ))}
        </group>
        <MediaYellowTextAnimator />

        <group visible={activeNodeMedia.includes("XA")}>
          <RightSide activeMediaComponent={activeMediaComponent} />
          <Lof />
          <AudioVisualizer />
          <Images />
        </group>
      </group>
      <MediaSceneEventManager />
    </perspectiveCamera>
  );
};

export default MediaScene;
