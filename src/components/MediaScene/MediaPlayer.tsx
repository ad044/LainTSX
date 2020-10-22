import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import test from "../../static/movie/test.webm";
import { useMediaStore } from "../../store";
import { useFrame } from "react-three-fiber";

const MediaPlayer = () => {
  const setMediaDuration = useMediaStore((state) => state.setMediaDuration);
  const mediaDuration = useMediaStore((state) => state.mediaDuration);
  const setMediaTimeElapsed = useMediaStore(
    (state) => state.setMediaTimeElapsed
  );

  const [perc, setPerc] = useState(0);
  const onDuration = useCallback(
    (duration: number) => {
      setMediaDuration(duration);
    },
    [setMediaDuration]
  );
  const t = useRef<any>();
  const onProgress = useCallback(
    (progress) => {
      const secondsElapsed = progress.played * mediaDuration;
      const percentageComplete = Math.round(
        (secondsElapsed / mediaDuration) * 100
      );
      setPerc(percentageComplete);
    },
    [mediaDuration]
  );

  return (
    <ReactPlayer
      className="react-player"
      controls={true}
      url={[{ src: test, type: "video/webm" }]}
      onDuration={onDuration}
      onProgress={onProgress}
      ref={t}
    />
  );
};

export default MediaPlayer;
