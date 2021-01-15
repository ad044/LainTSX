import React, { useEffect, useState } from "react";
import GateSide from "../components/GateScene/GateSide";
import { OrbitControls } from "@react-three/drei";
import GateHUD from "../components/GateScene/GateHUD";
import GateMiddleObject from "../components/GateScene/GateMiddleObject";
import { useGateStore } from "../store";
import GateSceneManager from "../core/StateManagers/GateSceneManager";

const GateScene = () => {
  const gateLvl = useGateStore((state) => state.gateLvl);
  const [introAnim, setIntroAnim] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIntroAnim(false);
    }, 2500);
  }, []);

  return (
    <perspectiveCamera position-z={3}>
      <pointLight intensity={5.2} color={0xffffff} position={[-2, 0, 0]} />
      <OrbitControls />
      <GateSide />
      <GateHUD intro={introAnim} gateLvl={gateLvl} />
      <GateMiddleObject intro={introAnim} gateLvl={gateLvl} />
      <GateSceneManager />
    </perspectiveCamera>
  );
};
export default GateScene;
