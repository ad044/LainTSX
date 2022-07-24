import React, { useEffect } from "react";
import { useStore } from "@/store";
import Images from "@canvas/objects/Images";
import { handleEvent } from "@/core";
import { exitIdleScene, resetInputCooldown } from "@/core/events";
import { isAudioOnly } from "@/utils/node";

const IdleMediaScene = () => {
  const mediaPercentageElapsed = useStore(
    (state) => state.mediaPercentageElapsed
  );

  const language = useStore((state) => state.language);
  const data = useStore((state) => state.idleSceneData);

  useEffect(() => {
    setTimeout(() => handleEvent(resetInputCooldown), 1500);
  }, []);

  useEffect(() => {
    if (mediaPercentageElapsed === 100) {
      handleEvent(exitIdleScene);
    }
  }, [mediaPercentageElapsed]);

  useEffect(() => {
    const mediaElement = document.getElementById("media") as HTMLMediaElement;
    const trackElement = document.getElementById("track") as HTMLTrackElement;

    if (mediaElement) {
      mediaElement.currentTime = 0;

      if (data.nodeName) {
        trackElement.src = `/media/webvtt/${language}/${data.nodeName}.vtt`;
      }

      const media = data.mediaFile;
      if (isAudioOnly(data.mediaFile)) {
        mediaElement.src = `media/audio/${media}.mp4`;
      } else {
        mediaElement.src = `media/movie/${media}.mp4`;
      }
      mediaElement.load();
      mediaElement.play();
    }
  }, [data.mediaFile, data.nodeName, language]);

  return (
    <>
      {data.imageTableIndices && (
        <Images imageTableIndices={data.imageTableIndices} />
      )}
    </>
  );
};

export default IdleMediaScene;
