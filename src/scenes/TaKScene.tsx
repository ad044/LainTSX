import React, { useEffect, useState } from "react";
import LainSpeak from "../components/LainSpeak";
import { createAudioAnalyser, useStore } from "../store";

const TaKScene = () => {
  const setScene = useStore((state) => state.setScene);
  const setAudioAnalyser = useStore((state) => state.setAudioAnalyser);

  const activeNode = useStore((state) => state.activeNode);

  const [isIntro, setIsIntro] = useState(true);
  const [isOutro, setIsOutro] = useState(false);

  const percentageElapsed = useStore((state) => state.mediaPercentageElapsed);

  const setNodeViewed = useStore((state) => state.setNodeViewed);

  useEffect(() => {
    setNodeViewed(activeNode.node_name, {
      is_viewed: 1,
      is_visible: 1,
    });
  }, [activeNode.node_name, setNodeViewed]);

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
        import("../static/media/webvtt/" + activeNode.node_name + ".vtt")
          .then((vtt) => {
            if (vtt) trackElement.src = vtt.default;
          })
          // some entries have no spoken words, so the file doesnt exist. we catch that here.
          .catch(() => {
            trackElement.removeAttribute("src");
          });

        if (activeNode.media_file.includes("XA")) {
          import(
            "../static/media/audio/" + activeNode.media_file + ".ogg"
          ).then((media) => {
            mediaElement.src = media.default;
            mediaElement.load();
            mediaElement.play();
          });
        } else {
          import(
            "../static/media/movie/" + activeNode.media_file + "[0].webm"
          ).then((media) => {
            mediaElement.src = media.default;
            mediaElement.load();
            mediaElement.play();
          });
        }
        setIsIntro(false);
      }
    }, 3800);
  }, [activeNode.media_file, activeNode.node_name, setAudioAnalyser]);

  return <LainSpeak intro={isIntro} outro={isOutro} />;
};

export default TaKScene;
