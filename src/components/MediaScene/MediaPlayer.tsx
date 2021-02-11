import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useStore } from "../../store";
import endroll from "../../static/movie/ENDROLL1.STR[0].webm";
import xa0001 from "../../static/audio/Xa0001.mp4";
import xa0006 from "../../static/audio/Xa0006.mp4";

const MediaPlayer = () => {
  const currentScene = useStore((state) => state.currentScene);
  const setScene = useStore((state) => state.setScene);

  const setPercentageElapsed = useStore((state) => state.setPercentageElapsed);

  const nodeName = useStore((state) => state.activeNode.node_name);
  const idleMedia = useStore((state) => state.idleMedia);
  const nodeMedia = useStore((state) => state.activeNode.media_file);

  const triggersFinalVideo = useStore(
    (state) => state.activeNode.triggers_final_video
  );

  const requestRef = useRef();
  const videoRef = createRef<HTMLVideoElement>();
  const trackRef = createRef<HTMLTrackElement>();
  const subtitleRef = createRef<HTMLParagraphElement>();

  // end scene specific stuff
  const endMediaPlayedCount = useStore((state) => state.endMediaPlayedCount);
  const incrementEndMediaPlayedCount = useStore(
    (state) => state.incrementEndMediaPlayedCount
  );
  const resetEndMediaPlayedCount = useStore(
    (state) => state.resetEndMediaPlayedCount
  );

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

      if (percentageElapsed % 5 === 0 && percentageElapsed !== 0) {
        setPercentageElapsed(percentageElapsed);
        if (percentageElapsed === 100) {
          if (currentScene === "media") setPercentageElapsed(0);
          videoRef.current.currentTime = 0;
          if (currentScene === "idle_media") {
            videoRef.current.pause();
            setScene("main");
          } else {
            if (currentScene === "end") {
              incrementEndMediaPlayedCount();
            } else {
              if (triggersFinalVideo === 1) {
                resetEndMediaPlayedCount();
                setScene("end");
              } else {
                videoRef.current.pause();
              }
            }
          }
        }
      }
    }
  }, [
    currentScene,
    incrementEndMediaPlayedCount,
    resetEndMediaPlayedCount,
    setPercentageElapsed,
    setScene,
    triggersFinalVideo,
    videoRef,
  ]);

  useEffect(() => {
    (requestRef.current as any) = requestAnimationFrame(updateTime);
    const curr = requestRef.current;
    return () => cancelAnimationFrame(curr as any);
  }, [updateTime]);

  const endMediaSource = useMemo(() => {
    switch (endMediaPlayedCount) {
      case 0:
        return endroll;
      case 1:
        return xa0001;
      case 2:
        return xa0006;
    }
  }, [endMediaPlayedCount]);

  useEffect(() => {
    if (currentScene === "end") {
      if (endMediaPlayedCount === 0) {
        if (videoRef.current) {
          videoRef.current.load();
          videoRef.current.play().catch((e) => {
            console.log(e);
          });
        }
      } else if (endMediaPlayedCount === 1) {
        if (videoRef.current) {
          videoRef.current.load();
        }
      } else if (endMediaPlayedCount === 2) {
        if (videoRef.current) {
          videoRef.current.load();
          videoRef.current.play();
        }
      }
    } else {
      import("../../static/webvtt/" + nodeName + ".vtt").then((vtt) => {
        if (trackRef.current) {
          trackRef.current.src = vtt.default;
        }
      });
      if (
        currentScene === "media" ||
        currentScene === "tak" ||
        currentScene === "idle_media"
      ) {
        if (currentScene === "media") setPercentageElapsed(0);
        const mediaToPlay =
          currentScene === "idle_media" ? idleMedia : nodeMedia;
        if (mediaToPlay) {
          if (mediaToPlay.includes("XA")) {
            import("../../static/audio/" + mediaToPlay + ".ogg").then(
              (media) => {
                if (videoRef.current) {
                  videoRef.current.src = media.default;
                  videoRef.current.load();
                }
              }
            );
          } else {
            import("../../static/movie/" + mediaToPlay + "[0].webm").then(
              (media) => {
                if (videoRef.current) {
                  videoRef.current.src = media.default;
                  videoRef.current.load();
                }
              }
            );
          }
        }
      }
    }
  }, [
    currentScene,
    endMediaPlayedCount,
    idleMedia,
    nodeMedia,
    nodeName,
    setPercentageElapsed,
    trackRef,
    videoRef,
  ]);

  return (
    <>
      <video width="800" height="600" id="media" ref={videoRef} controls>
        <track ref={trackRef} kind="captions" default />
      </video>
      <div id={"subtitle-container"}>
        <p ref={subtitleRef} id={"subtitle"} />
      </div>
    </>
  );
};

export default MediaPlayer;
