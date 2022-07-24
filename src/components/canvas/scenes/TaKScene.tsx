import React, { useEffect, useState } from "react";
import LainSpeak from "@canvas/objects/LainSpeak";
import { useStore } from "@/store";
import { GameScene } from "@/types";
import { createAudioAnalyser } from "@/utils/audio";
import { handleEvent } from "@/core";
import { enterScene, setAudioAnalyser } from "@/core/events";

const TaKScene = () => {
  const language = useStore((state) => state.language);

  const node = useStore((state) => state.node);

  const [isIntro, setIsIntro] = useState(true);
  const [isOutro, setIsOutro] = useState(false);

  const percentageElapsed = useStore((state) => state.mediaPercentageElapsed);

  useEffect(() => {
    if (percentageElapsed === 100) {
      setIsOutro(true);

      setTimeout(() => handleEvent(enterScene(GameScene.Main)), 4600);
    }
  }, [percentageElapsed]);

  useEffect(() => {
    setTimeout(() => {
      const mediaElement = document.getElementById("media") as HTMLMediaElement;
      const trackElement = document.getElementById("track") as HTMLTrackElement;

      if (mediaElement) {
        handleEvent(setAudioAnalyser(createAudioAnalyser()));
        mediaElement.currentTime = 0;

        if (node) {
          trackElement.src = `/media/webvtt/${language}/${node.name}/.vtt`;

          mediaElement.src = `/media/audio/${node.media_file}.mp4`;
          mediaElement.load();
          mediaElement.play();
        }

        setIsIntro(false);
      }
    }, 3800);
  }, [node, language]);

  return <LainSpeak intro={isIntro} outro={isOutro} />;
};

export default TaKScene;
