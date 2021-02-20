import React, { useEffect } from "react";
import PolytanBear from "../components/PolytanScene/PolytanBear";
import PolytanBackground from "../components/PolytanScene/PolytanBackground";
import { useStore } from "../store";

const PolytanScene = () => {
  const setNodeViewed = useStore((state) => state.setNodeViewed);
  const setPolytanPartUnlocked = useStore.getState().setPolytanPartUnlocked;
  const activeNodeName = useStore((state) => state.activeNode.node_name);

  useEffect(() => {
    setNodeViewed(activeNodeName, {
      is_viewed: 1,
      is_visible: 0,
    });
    const bodyPart = (() => {
      switch (parseInt(activeNodeName.slice(-1))) {
        case 6:
          return "head";
        case 5:
          return "rightArm";
        case 4:
          return "leftArm";
        case 3:
          return "rightLeg";
        case 2:
          return "leftLeg";
        case 1:
          return "body";
      }
    })();
    if (bodyPart) setPolytanPartUnlocked(bodyPart);
  }, [activeNodeName, setNodeViewed, setPolytanPartUnlocked]);

  return (
    <>
      <PolytanBear />
      <PolytanBackground />
    </>
  );
};

export default PolytanScene;
