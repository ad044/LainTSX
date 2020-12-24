import React, { useEffect } from "react";
import { useSceneStore } from "../store";

const ChangeDiscScene = () => {
  const setScene = useSceneStore((state) => state.setScene);
  useEffect(() => {
    document.getElementsByTagName("canvas")[0].className =
      "change-disc-scene-background";

    setTimeout(() => {
      setScene("main");
    }, 3500);

    return () => {
      document.getElementsByTagName("canvas")[0].className =
        "main-scene-background";
    };
  }, [setScene]);

  return <></>;
};

export default ChangeDiscScene;
