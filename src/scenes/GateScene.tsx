import React from "react";
import GateSide from "../components/GateScene/GateSide";
import { OrbitControls } from "drei";
import GateMiddle from "../components/GateScene/GateMiddle";

const GateScene = () => {
  return (
    <perspectiveCamera position-z={3}>
      <OrbitControls />
      <pointLight intensity={5.2} color={0xffffff} position={[-2, 0, 0]} />
      <GateSide />
      <GateMiddle/>
    </perspectiveCamera>
  );
};
export default GateScene;
