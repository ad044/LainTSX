import React from "react";
import About from "./About";
import Prompt from "../../Prompt";
import PermissionDenied from "./PermissionDenied";
import { useStore } from "../../../store";
import Status from "../../Status";

const PausePopUps = () => {
  const subscene = useStore((state) => state.mainSubscene);

  const showingAbout = useStore((state) => state.showingAbout);
  const promptVisible = useStore((state) => state.promptVisible);
  const permissionDenied = useStore((state) => state.permissionDenied);

  return (
    <group
      position={[-0.85, -0.7, 0]}
      scale={[0.85, 0.85, 0]}
      visible={subscene === "pause"}
    >
      {showingAbout && <About />}
      <group
        position={[1, 0.6, 0]}
        scale={[1.2, 1.2, 0]}
        visible={promptVisible}
      >
        <Prompt />
      </group>
      <group
        position={[1, 0.6, 0]}
        scale={[1.2, 1.2, 0]}
        visible={permissionDenied}
      >
        <PermissionDenied />
      </group>

      <Status />
    </group>
  );
};

export default PausePopUps;
