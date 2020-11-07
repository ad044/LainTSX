import React from "react";
import GateSide from "../components/GateScene/GateSide";
import { OrbitControls } from "@react-three/drei";
import GateMiddle from "../components/GateScene/GateMiddle";

const GateScene = () => {
  return (
    <perspectiveCamera position-z={3}>
      <pointLight intensity={5.2} color={0xffffff} position={[-2, 0, 0]} />
      <OrbitControls />
      <GateSide />
      <GateMiddle />
    </perspectiveCamera>
  );
};
export default GateScene;
