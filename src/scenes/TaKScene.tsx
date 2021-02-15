import React, { useEffect, useState } from "react";
import LainSpeak from "../components/LainSpeak";
import { createAudioAnalyser, useStore } from "../store";
import sleep from "../utils/sleep";

const TaKScene = () => {
  const setScene = useStore((state) => state.setScene);
  const setAudioAnalyser = useStore((state) => state.setAudioAnalyser);

  const nodeMedia = useStore((state) => state.activeNode.media_file);
  const nodeName = useStore((state) => state.activeNode.node_name);

  const [isIntro, setIsIntro] = useState(true);
  const [isOutro, setIsOutro] = useState(false);

  const percentageElapsed = useStore((state) => state.mediaPercentageElapsed);

  useEffect(() => {
    if (percentageElapsed === 100) {
      setIsOutro(true);

      setTimeout(() => setScene("main"), 4600);
    }
  }, [percentageElapsed, setScene]);

  useEffect(() => {
    setTimeout(() => {
      const mediaElement = document.getElementById("media") as HTMLMediaElement;
      const trackElement = document.getElementById("track") as HTMLTrackElement;

      if (mediaElement) {
        setAudioAnalyser(createAudioAnalyser());
        mediaElement.currentTime = 0;
        import("../static/webvtt/" + nodeName + ".vtt")
          .then((vtt) => {
            if (vtt) trackElement.src = vtt.default;
          })
          // some entries have no spoken words, so the file doesnt exist. we catch that here.
          .catch((e) => console.log(e));

        if (nodeMedia.includes("XA")) {
          import("../static/audio/" + nodeMedia + ".ogg").then((media) => {
            mediaElement.src = media.default;
            mediaElement.load();
            mediaElement.play();
          });
        } else {
          import("../static/movie/" + nodeMedia + "[0].webm").then((media) => {
            mediaElement.src = media.default;
            mediaElement.load();
            mediaElement.play();
          });
        }
        setIsIntro(false);
      }
    }, 3800);
  }, [nodeMedia, nodeName, setAudioAnalyser]);

  return <LainSpeak intro={isIntro} outro={isOutro} />;
};

export default TaKScene;
