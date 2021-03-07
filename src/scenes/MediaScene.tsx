import React, { useEffect, useMemo, useState } from "react";
import { createAudioAnalyser, useStore } from "../store";
import LeftSide from "../components/MediaScene/Selectables/LeftSide";
import RightSide from "../components/MediaScene/Selectables/RightSide";
import AudioVisualizer from "../components/MediaScene/AudioVisualizer/AudioVisualizer";
import MediaProgressBar from "../components/MediaScene/MediaProgressBar";
import NodeNameContainer from "../components/MediaScene/NodeNameContainer";
import Images from "../components/Images";
import GreenTextRenderer from "../components/TextRenderer/GreenTextRenderer";
import MediaYellowTextAnimator from "../components/TextRenderer/MediaYellowTextAnimator";
import Loading from "../components/Loading";

const MediaScene = () => {
  const percentageElapsed = useStore((state) => state.mediaPercentageElapsed);

  const setInputCooldown = useStore((state) => state.setInputCooldown);
  const setAudioAnalyser = useStore((state) => state.setAudioAnalyser);

  const activeNode = useStore((state) => state.activeNode);

  const setScene = useStore((state) => state.setScene);
  const incrementFinalVideoViewCount = useStore(
    (state) => state.incrementFinalVideoViewCount
  );

  useEffect(() => {
    if (percentageElapsed === 100 && activeNode.triggers_final_video) {
      setScene("end");
      incrementFinalVideoViewCount();
    }
  }, [
    activeNode.triggers_final_video,
    incrementFinalVideoViewCount,
    percentageElapsed,
    setScene,
  ]);

  const isAudioOnly = useMemo(() => activeNode.media_file.includes("XA"), [
    activeNode,
  ]);

  useEffect(() => {
    const mediaElement = document.getElementById("media") as HTMLMediaElement;
    const trackElement = document.getElementById("track") as HTMLTrackElement;

    if (mediaElement) {
      setAudioAnalyser(createAudioAnalyser());

      mediaElement.currentTime = 0;
      import("../static/media/webvtt/" + activeNode.node_name + ".vtt")
        .then((vtt) => {
          if (vtt) trackElement.src = vtt.default;
        })
        // some entries have no spoken words, so the file doesnt exist. we catch that here.
        .catch(() => {
          trackElement.removeAttribute("src");
        });

      if (isAudioOnly) {
        import("../static/media/audio/" + activeNode.media_file + ".mp4").then(
          (media) => {
            mediaElement.src = media.default;
            mediaElement.load();
          }
        );
      } else {
        import("../static/media/movie/" + activeNode.media_file + ".mp4").then(
          (media) => {
            mediaElement.src = media.default;
            mediaElement.load();
          }
        );
      }
    }
  }, [
    activeNode.media_file,
    activeNode.node_name,
    isAudioOnly,
    setAudioAnalyser,
  ]);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    setTimeout(() => setInputCooldown(500), 1000);
  }, [setInputCooldown]);

  return (
    <group position-z={3}>
      {loaded ? (
        <group position={[0.4, -0.3, 0]}>
          <pointLight intensity={1.2} color={0xffffff} position={[-2, 0, 0]} />
          <LeftSide />
          <group position={[0, 0.5, -3]}>
            <MediaProgressBar />
            <NodeNameContainer />
          </group>
          <group scale={[0.06, 0.12, 0]} position={[0.8, 1.37, 0]}>
            <GreenTextRenderer />
          </group>
          <MediaYellowTextAnimator />

          <group visible={isAudioOnly}>
            <RightSide />
            <AudioVisualizer />
            <Images />
          </group>
        </group>
      ) : (
        <Loading />
      )}
    </group>
  );
};

export default MediaScene;
