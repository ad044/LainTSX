import React, { createRef, useCallback, useRef } from "react";
import test from "../../static/movie/LAIN01.XA[18].ogg";
import { useMediaStore } from "../../store";

const MediaPlayer = () => {
  const setMediaPercentageElapsed = useMediaStore(
    (state) => state.setMediaPercentageElapsed
  );

  const requestRef = useRef();
  const videoRef = createRef<HTMLVideoElement>();

  const updateTime = useCallback(() => {
    (requestRef.current as any) = requestAnimationFrame(updateTime);
    if (videoRef.current) {
      const timeElapsed = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
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

  return (
    <video width="800" height="600" controls autoPlay id="media" ref={videoRef}>
      <source src={test} />
    </video>
  );
};

export default MediaPlayer;
