import React, { useEffect } from "react";
import { useStore } from "../store";
import sleep from "../utils/sleep";

const ChangeDiscScene = () => {
  const setScene = useStore((state) => state.setScene);
  const currentSite = useStore((state) => state.activeSite);

  useEffect(() => {
    (async () => {
      if (currentSite === "a") {
        document.getElementsByTagName("canvas")[0].className =
          "change-disc-scene-a-background";
      } else if (currentSite === "b") {
        document.getElementsByTagName("canvas")[0].className =
          "change-disc-scene-b-background";
      }

      await sleep(3500);
      setScene("main");

      return () => {
        document.getElementsByTagName("canvas")[0].className =
          "main-scene-background";
      };
    })();
  }, [currentSite, setScene]);

  return <></>;
};

export default ChangeDiscScene;
