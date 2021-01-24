import React from "react";
import PolytanBear from "../components/PolytanScene/PolytanBear";
import PolytanBackground from "../components/PolytanScene/PolytanBackground";
import { useStore } from "../store";

const PolytanScene = () => {
  const unlockedParts = useStore(
    (state) => state.polytanUnlockedParts
  );

  return (
    <perspectiveCamera>
      <PolytanBear unlockedParts={unlockedParts} />
      <PolytanBackground />
    </perspectiveCamera>
  );
};

export default PolytanScene;
