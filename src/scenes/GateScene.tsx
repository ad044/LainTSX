import React, { useEffect, useState } from "react";
import GateSide from "../components/GateScene/GateSide";
import GateHUD from "../components/GateScene/GateHUD";
import GateMiddleObject from "../components/GateScene/GateMiddleObject";
import { useStore } from "../store";

const GateScene = () => {
  const gateLvl = useStore((state) => state.gameProgress.gate_level);
  const incrementGateLvl = useStore((state) => state.incrementGateLvl);
  const [introAnim, setIntroAnim] = useState(true);

  const activeNodeName = useStore((state) => state.activeNode.node_name);
  const setNodeViewed = useStore((state) => state.setNodeViewed);
  const setInputCooldown = useStore((state) => state.setInputCooldown);

  useEffect(() => {
    incrementGateLvl();
    setNodeViewed(activeNodeName, {
      is_viewed: 1,
      is_visible: 0,
    });
    setTimeout(() => setIntroAnim(false), 2500);
    setTimeout(() => setInputCooldown(0), 3500);
  }, [activeNodeName, incrementGateLvl, setInputCooldown, setNodeViewed]);

  return (
    <perspectiveCamera position-z={3}>
      <pointLight intensity={5.2} color={0xffffff} position={[-2, 0, 0]} />
      <GateSide />
      <GateHUD intro={introAnim} gateLvl={gateLvl} />
      <GateMiddleObject intro={introAnim} gateLvl={gateLvl} />
    </perspectiveCamera>
  );
};
export default GateScene;
