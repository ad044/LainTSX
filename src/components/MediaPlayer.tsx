import React, { createRef, useCallback, useEffect, useRef } from "react";
import { useStore } from "../store";

const MediaPlayer = () => {
  const setPercentageElapsed = useStore((state) => state.setPercentageElapsed);

  // use it as a guard to avoid multiple set states inside updateTime
  const lastSetPercentageRef = useRef<undefined | number>(undefined);

  const requestRef = useRef();
  const videoRef = createRef<HTMLVideoElement>();
  const trackRef = createRef<HTMLTrackElement>();
  const subtitleRef = createRef<HTMLParagraphElement>();

  useEffect(() => {
    const handleCueChange = (e: any) => {
      const { track } = e.target;
      const { activeCues } = track;
      const text = [...activeCues].map(
        (cue) => cue.getCueAsHTML().textContent
      )[0];
      if (subtitleRef.current && videoRef.current) {
        if (!text || videoRef.current.currentTime === 0)
          subtitleRef.current.textContent = text;
        else subtitleRef.current.textContent = text;
      }
    };

    if (trackRef.current) {
      trackRef.current.addEventListener("cuechange", handleCueChange);
    }
  }, [subtitleRef, trackRef, videoRef]);

  const updateTime = useCallback(() => {
    (requestRef.current as any) = requestAnimationFrame(updateTime);
    if (videoRef.current) {
      const timeElapsed = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const percentageElapsed = Math.floor((timeElapsed / duration) * 100);

      if (
        percentageElapsed % 5 === 0 &&
        lastSetPercentageRef.current !== percentageElapsed
      ) {
        setPercentageElapsed(percentageElapsed);
        lastSetPercentageRef.current = percentageElapsed;
      }
    }
  }, [setPercentageElapsed, videoRef]);

  useEffect(() => {
    (requestRef.current as any) = requestAnimationFrame(updateTime);
    const curr = requestRef.current;
    return () => {
      cancelAnimationFrame(curr as any);
      setPercentageElapsed(0);
    };
  }, [setPercentageElapsed, updateTime]);

  return (
    <>
      <video width="800" height="600" id="media" ref={videoRef}>
        <track id={"track"} ref={trackRef} kind="captions" default />
      </video>
      <div id={"subtitle-container"}>
        <p ref={subtitleRef} id={"subtitle"} />
      </div>
    </>
  );
};

export default MediaPlayer;
