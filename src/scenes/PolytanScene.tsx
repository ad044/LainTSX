import React, { useEffect } from "react";
import PolytanBear from "../components/PolytanScene/PolytanBear";
import PolytanBackground from "../components/PolytanScene/PolytanBackground";
import { useStore } from "../store";

const PolytanScene = () => {
  const setNodeViewed = useStore((state) => state.setNodeViewed);
  const setPolytanPartUnlocked = useStore(
    (state) => state.setPolytanPartUnlocked
  );
  const setInputCooldown = useStore((state) => state.setInputCooldown);
  const activeNodeName = useStore((state) => state.activeNode.node_name);

  useEffect(() => {
    setTimeout(() => setInputCooldown(0), 1000);
    setNodeViewed(activeNodeName);
    const bodyPart = (() => {
      switch (parseInt(activeNodeName.slice(-1))) {
        case 6:
          return "head";
        case 5:
          return "right_arm";
        case 4:
          return "left_arm";
        case 3:
          return "right_leg";
        case 2:
          return "left_leg";
        case 1:
          return "body";
      }
    })();
    if (bodyPart) setPolytanPartUnlocked(bodyPart);
  }, [activeNodeName, setInputCooldown, setNodeViewed, setPolytanPartUnlocked]);

  return (
    <>
      <PolytanBear />
      <PolytanBackground />
    </>
  );
};

export default PolytanScene;
