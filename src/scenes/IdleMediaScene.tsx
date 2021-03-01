import React, { useEffect } from "react";
import { useStore } from "../store";
import Images from "../components/Images";

const IdleMediaScene = () => {
  const mediaPercentageElapsed = useStore(
    (state) => state.mediaPercentageElapsed
  );

  const idleMedia = useStore((state) => state.idleMedia);
  const idleNodeName = useStore((state) => state.idleNodeName);
  const setInputCooldown = useStore((state) => state.setInputCooldown);

  useEffect(() => {
    setInputCooldown(0);
  }, [setInputCooldown]);

  useEffect(() => {
    if (mediaPercentageElapsed === 100)
      useStore.setState({
        currentScene: "main",
        idleStarting: false,
        intro: false,
        inputCooldown: -1,
      });
  }, [mediaPercentageElapsed]);

  useEffect(() => {
    const mediaElement = document.getElementById("media") as HTMLMediaElement;
    const trackElement = document.getElementById("track") as HTMLTrackElement;

    if (mediaElement) {
      mediaElement.currentTime = 0;
      if (idleNodeName) {
        import("../static/webvtt/" + idleNodeName + ".vtt")
          .then((vtt) => {
            if (vtt) trackElement.src = vtt.default;
          })
          // some entries have no spoken words, so the file doesnt exist. we catch that here.
          .catch(() => console.log("no subtitles for this media"));
      }

      if (idleMedia.includes("XA")) {
        import("../static/audio/" + idleMedia + ".ogg").then((media) => {
          mediaElement.src = media.default;
          mediaElement.load();
          mediaElement.play();
        });
      } else {
        import("../static/movie/" + idleMedia + "[0].webm").then((media) => {
          mediaElement.src = media.default;
          mediaElement.load();
          mediaElement.play();
        });
      }
    }
  }, [idleMedia, idleNodeName]);

  return (
    <group visible={idleMedia.includes("XA")}>
      <Images />
    </group>
  );
};

export default IdleMediaScene;
