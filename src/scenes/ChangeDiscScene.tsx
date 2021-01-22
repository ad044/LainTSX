import React, { useEffect } from "react";
import { useMainSceneStore, useSceneStore } from "../store";

const ChangeDiscScene = () => {
  const setScene = useSceneStore((state) => state.setScene);
  const currentSite = useMainSceneStore((state) => state.activeSite);

  useEffect(() => {
    if (currentSite === "a") {
      document.getElementsByTagName("canvas")[0].className =
        "change-disc-scene-a-background";
    } else if (currentSite === "b") {
      document.getElementsByTagName("canvas")[0].className =
        "change-disc-scene-b-background";
    }

    setTimeout(() => {
      setScene("main");
    }, 3500);

    return () => {
      document.getElementsByTagName("canvas")[0].className =
        "main-scene-background";
    };
  }, [currentSite, setScene]);

  return <></>;
};

export default ChangeDiscScene;
