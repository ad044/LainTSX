import React, { useEffect } from "react";
import { useIdleStore } from "../store";
import Images from "../components/MediaScene/Images";

const IdleMediaScene = () => {
  const idleMedia = useIdleStore((state) => state.media);

  useEffect(() => {
    document.getElementsByTagName("canvas")[0].className =
      "media-scene-background";

    return () => {
      document.getElementsByTagName("canvas")[0].className = "";
    };
  }, []);

  return (
    <group visible={idleMedia.includes("XA")}>
      <Images />
    </group>
  );
};

export default IdleMediaScene;
