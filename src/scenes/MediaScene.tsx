import React, { useCallback, useEffect } from "react";
import {
  useIdleStore,
  useLevelStore,
  useMediaStore,
  useNodeStore,
  useSceneStore,
  useSiteStore,
} from "../store";
import LeftSide from "../components/MediaScene/Selectables/LeftSide";
import RightSide from "../components/MediaScene/Selectables/RightSide";
import AudioVisualizer from "../components/MediaScene/AudioVisualizer/AudioVisualizer";
import MediaLoadingBar from "../components/MediaScene/MediaLoadingBar";
import NodeNameContainer from "../components/MediaScene/NodeNameContainer";
import Lof from "../components/MediaScene/Lof";
import Images from "../components/MediaScene/Images";
import MediumLetter from "../components/TextRenderer/MediumLetter";
import site_a from "../resources/site_a.json";
import { SiteType } from "../components/MainScene/SyncedComponents/Site";
import MediaYellowTextAnimator from "../components/TextRenderer/MediaYellowTextAnimator";
import site_b from "../resources/site_b.json";

const MediaScene = () => {
  const currentScene = useSceneStore((state) => state.currentScene);
  const mediaComponentMatrixIndices = useMediaStore(
    (state) => state.componentMatrixIndices
  );

  const idleMedia = useIdleStore((state) => state.media);
  const activeNodeId = useNodeStore((state) => state.activeNodeState.id);
  const activeLevel = useLevelStore((state) => state.activeLevel);

  const currentSite = useSiteStore((state) => state.currentSite);

  const siteData = currentSite === "a" ? site_a : site_b;

  const activeNodeData = (siteData as SiteType)[activeLevel][activeNodeId];
  const activeNodeName = activeNodeData.node_name;
  const activeNodeMedia = activeNodeData.media_file;

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
          {activeNodeName.split("").map((letter, idx) => (
            <MediumLetter letter={letter} letterIdx={idx} key={idx} />
          ))}
        </group>
        <MediaYellowTextAnimator />
        {activeNodeMedia.includes("XA") || idleMedia.includes("XA") ? (
          <>
            {currentScene !== "idle_media" ? (
              <>
                <RightSide activeMediaComponent={activeMediaComponent} />
                <Lof />
                <AudioVisualizer />
              </>
            ) : (
              <></>
            )}
            <Images />
          </>
        ) : (
          <></>
        )}
      </group>
    </perspectiveCamera>
  );
};

export default MediaScene;
