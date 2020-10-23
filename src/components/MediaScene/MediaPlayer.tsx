import React, { useCallback, useRef, useState } from "react";
import ReactPlayer from "react-player";
import test from "../../static/movie/test.webm";
import { useMediaStore } from "../../store";

const MediaPlayer = () => {
  const setMediaPercentageElapsed = useMediaStore(
    (state) => state.setMediaPercentageElapsed
  );

  const requestRef = useRef();

  const updateTime = useCallback(() => {
    (requestRef.current as any) = requestAnimationFrame(updateTime);
    if (t.current) {
      const timeElapsed = t.current.getCurrentTime();
      const duration = t.current.getDuration();
      const percentageElapsed = Math.floor((timeElapsed / duration) * 100);

      if (percentageElapsed % 5 === 0) {
        setMediaPercentageElapsed(percentageElapsed);
      }
    }
  }, [setMediaPercentageElapsed]);

  React.useEffect(() => {
    (requestRef.current as any) = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(requestRef.current as any);
  }, [updateTime]);

  const t = useRef<any>();

  return (
    <video width="800" height="600" controls autoPlay id="media">
      <source src={test} />
    </video>
  );
};

export default MediaPlayer;
