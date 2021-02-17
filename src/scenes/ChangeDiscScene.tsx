import React, { useEffect } from "react";
import { useStore } from "../store";

const ChangeDiscScene = () => {
  const setScene = useStore((state) => state.setScene);
  const activeSite = useStore((state) => state.activeSite);

  useEffect(() => {
    if (activeSite === "a") {
      document.getElementsByTagName("canvas")[0].className =
        "change-disc-scene-a-background";
    } else if (activeSite === "b") {
      document.getElementsByTagName("canvas")[0].className =
        "change-disc-scene-b-background";
    }

    setTimeout(() => setScene("main"), 3500);

    return () => {
      document.getElementsByTagName("canvas")[0].className =
        "main-scene-background";
    };
  }, [activeSite, setScene]);

  return <></>;
};

export default ChangeDiscScene;
