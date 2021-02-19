import React, { memo } from "react";
import About from "./About";
import Prompt from "../../Prompt";
import PermissionDenied from "./PermissionDenied";
import Status from "../../Status";
import NotFound from "./NotFound";

const Popups = memo(() => {
  return (
    <>
      <group position={[-0.85, -0.7, 0]} scale={[0.85, 0.85, 0]}>
        <group position={[1, 0.6, 0]} scale={[1.2, 1.2, 0]}>
          <Prompt />
        </group>
        <About />
        <PermissionDenied />
        <Status />
      </group>
      <NotFound />
    </>
  );
});

export default Popups;
