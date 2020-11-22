import React from "react";
import PolytanBear from "../components/PolytanScene/PolytanBear";
import PolytanBackground from "../components/PolytanScene/PolytanBackground";
import { usePolytanStore } from "../store";

const PolytanScene = () => {
  const unlockedParts = usePolytanStore((state) => state.unlockedParts);

  return (
    <perspectiveCamera>
      <PolytanBear unlockedParts={unlockedParts} />
      <PolytanBackground />
    </perspectiveCamera>
  );
};

export default PolytanScene;
