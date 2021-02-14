import React, { useEffect } from "react";
import { createAudioAnalyser, useStore } from "../store";
import LeftSide from "../components/MediaScene/Selectables/LeftSide";
import RightSide from "../components/MediaScene/Selectables/RightSide";
import AudioVisualizer from "../components/MediaScene/AudioVisualizer/AudioVisualizer";
import MediaLoadingBar from "../components/MediaScene/MediaLoadingBar";
import NodeNameContainer from "../components/MediaScene/NodeNameContainer";
import Images from "../components/Images";
import GreenTextRenderer from "../components/TextRenderer/GreenTextRenderer";
import MediaYellowTextAnimator from "../components/TextRenderer/MediaYellowTextAnimator";

const MediaScene = () => {
  const percentageElapsed = useStore((state) => state.mediaPercentageElapsed);

  const setAudioAnalyser = useStore((state) => state.setAudioAnalyser);

  const activeNode = useStore((state) => state.activeNode);

  const setScene = useStore((state) => state.setScene);

  useEffect(() => {
    document.getElementsByTagName("canvas")[0].className =
      "media-scene-background";

    return () => {
      document.getElementsByTagName("canvas")[0].className = "";
    };
  }, []);

  useEffect(() => {
    if (percentageElapsed === 100) {
      setScene("end");
    }
  }, [percentageElapsed, setScene]);

  useEffect(() => {
    const mediaElement = document.getElementById("media") as HTMLMediaElement;
    const trackElement = document.getElementById("track") as HTMLTrackElement;

    if (mediaElement) {
      setAudioAnalyser(createAudioAnalyser());

      mediaElement.currentTime = 0;
      import("../static/webvtt/" + activeNode.node_name + ".vtt")
        .then((vtt) => {
          if (vtt) trackElement.src = vtt.default;
        })
        // some entries have no spoken words, so the file doesnt exist. we catch that here.
        .catch((e) => console.log(e));

      if (activeNode.media_file.includes("XA")) {
        import("../static/audio/" + activeNode.media_file + ".ogg").then(
          (media) => {
            mediaElement.src = media.default;
            mediaElement.load();
          }
        );
      } else {
        import("../static/movie/" + activeNode.media_file + "[0].webm").then(
          (media) => {
            mediaElement.src = media.default;
            mediaElement.load();
          }
        );
      }
    }
  }, [activeNode.media_file, activeNode.node_name, setAudioAnalyser]);

  return (
    <perspectiveCamera position-z={3}>
      <group position={[0.4, -0.3, 0]}>
        <pointLight intensity={1.2} color={0xffffff} position={[-2, 0, 0]} />
        <LeftSide />
        <group position={[0, 0.5, -3]}>
          <MediaLoadingBar />
          <NodeNameContainer />
        </group>
        <group scale={[0.06, 0.12, 0]} position={[0.8, 1.37, 0]}>
          <GreenTextRenderer />
        </group>
        <MediaYellowTextAnimator />

        <group visible={activeNode.media_file.includes("XA")}>
          <RightSide />
          <AudioVisualizer />
          <Images />
        </group>
      </group>
    </perspectiveCamera>
  );
};

export default MediaScene;
