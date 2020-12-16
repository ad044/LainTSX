import React, { useCallback, useEffect, useMemo } from "react";
import {
  useLevelSelectionStore,
  useLevelStore,
  useMediaStore,
  useNodeStore,
} from "../store";
import GreenTextRenderer from "../components/TextRenderer/GreenTextRenderer";
import LeftSide from "../components/MediaScene/Selectables/LeftSide";
import RightSide from "../components/MediaScene/Selectables/RightSide";
import AudioVisualizer from "../components/MediaScene/AudioVisualizer/AudioVisualizer";
import MediaLoadingBar from "../components/MediaScene/MediaLoadingBar";
import NodeNameContainer from "../components/MediaScene/NodeNameContainer";
import Lof from "../components/MediaScene/Lof";
import { OrbitControls } from "@react-three/drei";
import Images from "../components/MediaScene/Images";
import YellowTextRenderer from "../components/TextRenderer/YellowTextRenderer";
import MediumLetter from "../components/TextRenderer/MediumLetter";
import { a } from "@react-spring/three";
import site_a from "../resources/site_a.json";
import { SiteType } from "../components/MainScene/Site";

const MediaScene = () => {
  const mediaComponentMatrixIndices = useMediaStore(
    (state) => state.componentMatrixIndices
  );

  const activeNodeId = useNodeStore((state) => state.activeNodeState.id);
  const activeLevel = useLevelStore((state) => state.activeLevel);

  const activeNodeName = (site_a as SiteType)[activeLevel][activeNodeId]
    .node_name;

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
        <group scale={[0.06, 0.12, 0]} position={[0.8, 1.37, 0]}>
          {activeNodeName.split("").map((letter, idx) => (
            <MediumLetter letter={letter} letterIdx={idx} key={idx} />
          ))}
        </group>

        <group position={[0, 0, 0]}>
          <YellowTextRenderer />
        </group>
        <Lof />
        <Images />
      </group>
    </perspectiveCamera>
  );
};

export default MediaScene;
