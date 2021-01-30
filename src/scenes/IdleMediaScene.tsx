import React, { useEffect } from "react";
import { useStore } from "../store";
import Images from "../components/MediaScene/Images";

const IdleMediaScene = () => {
  const idleMedia = useStore((state) => state.idleMedia);

  useEffect(() => {
    const mediaElement = document.getElementById("media") as HTMLMediaElement;

    if (mediaElement) {
      mediaElement.currentTime = 0;
      mediaElement.play();
    }
  }, []);

  return (
    <group visible={idleMedia.includes("XA")}>
      <Images />
    </group>
  );
};

export default IdleMediaScene;
