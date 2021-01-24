import React, { useEffect } from "react";
import { useStore } from "../store";
import Images from "../components/MediaScene/Images";

const IdleMediaScene = () => {
  const idleMedia = useStore((state) => state.idleMedia);

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
