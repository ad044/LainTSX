import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import site_a from "../../resources/site_a.json";
import site_b from "../../resources/site_b.json";
import {
  useEndSceneStore,
  useLevelStore,
  useMediaStore,
  useNodeStore,
  useSceneStore,
  useSiteStore,
} from "../../store";
import t from "../../static/webvtt/test.vtt";
import { SiteType } from "../MainScene/SyncedComponents/Site";
import endroll from "../../static/movie/b/ENDROLL1.STR[0].webm";
import xa0001 from "../../static/audio/a/Xa0001.mp4";
import xa0006 from "../../static/audio/a/Xa0006.mp4";

const MediaPlayer = () => {
  const [mediaSource, setMediaSource] = useState<any>();

  const currentScene = useSceneStore((state) => state.currentScene);
  const setScene = useSceneStore((state) => state.setScene);

  const setPercentageElapsed = useMediaStore(
    (state) => state.setPercentageElapsed
  );

  const activeNodeId = useNodeStore((state) => state.activeNodeState.id);
  const activeLevel = useLevelStore((state) => state.activeLevel);

  const requestRef = useRef();
  const videoRef = createRef<HTMLVideoElement>();

  const currentSite = useSiteStore((state) => state.currentSite);

  const siteData = useMemo(() => (currentSite === "a" ? site_a : site_b), [
    currentSite,
  ]);

  // end scene specific stuff
  const endMediaPlayedCount = useEndSceneStore(
    (state) => state.mediaPlayedCount
  );
  const incrementEndMediaPlayedCount = useEndSceneStore(
    (state) => state.incrementMediaPlayedCount
  );
  const resetEndMediaPlayedCount = useEndSceneStore(
    (state) => state.resetMediaPlayedCount
  );

  const updateTime = useCallback(() => {
    (requestRef.current as any) = requestAnimationFrame(updateTime);
    if (videoRef.current) {
      const timeElapsed = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const percentageElapsed = Math.floor((timeElapsed / duration) * 100);

      if (percentageElapsed % 5 === 0) {
        setPercentageElapsed(percentageElapsed);
        if (percentageElapsed === 100) {
          videoRef.current.currentTime = 0;
          if (currentScene === "end") {
            incrementEndMediaPlayedCount();
          } else {
            if (
              (siteData as SiteType)[activeLevel][activeNodeId]
                .triggers_final_video === 1
            ) {
              resetEndMediaPlayedCount();
              setScene("end");
            } else {
              videoRef.current.pause();
            }
          }
        }
      }
    }
  }, [
    activeLevel,
    activeNodeId,
    currentScene,
    incrementEndMediaPlayedCount,
    resetEndMediaPlayedCount,
    setPercentageElapsed,
    setScene,
    siteData,
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
    } else if (currentScene === "media" || currentScene === "tak") {
      const nodeMedia = (siteData as SiteType)[activeLevel][activeNodeId]
        .media_file;
      if (nodeMedia.includes("XA")) {
        import(
          "../../static/audio/" + currentSite + "/" + nodeMedia + ".ogg"
        ).then((media) => {
          setMediaSource(media.default);
          if (videoRef.current) {
            videoRef.current.load();
          }
        });
      } else {
        import(
          "../../static/movie/" + currentSite + "/" + nodeMedia + "[0].webm"
        ).then((media) => {
          setMediaSource(media.default);
          if (videoRef.current) {
            videoRef.current.load();
          }
        });
      }
    }
  }, [
    activeLevel,
    activeNodeId,
    currentScene,
    currentSite,
    endMediaPlayedCount,
    siteData,
    videoRef,
  ]);

  return (
    <video
      width="800"
      height="600"
      controls
      id="media"
      ref={videoRef}
      style={{
        display: ["media", "tak", "end"].includes(currentScene)
          ? "block"
          : "none",
      }}
      src={currentScene === "end" ? endMediaSource : mediaSource}
    >
      <track src={t} kind="captions" default />
    </video>
  );
};

export default MediaPlayer;
