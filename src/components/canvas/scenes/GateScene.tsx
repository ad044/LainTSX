import React, { useEffect, useState } from "react";
import GateSide from "@canvas/objects/GateScene/GateSide";
import GateHUD from "@canvas/objects/GateScene/GateHUD";
import GateMiddleObject from "@canvas/objects/GateScene/GateMiddleObject";
import { useStore } from "@/store";
import { handleEvent } from "@/core";
import { resetInputCooldown } from "@/core/events";

const GateScene = () => {
  const gateLvl = useStore((state) => state.gameProgress.gate_level);
  const [introAnim, setIntroAnim] = useState(true);

  useEffect(() => {
    setTimeout(() => setIntroAnim(false), 2500);
    setTimeout(() => handleEvent(resetInputCooldown), 3500);
  }, [gateLvl]);

  return (
    <group position-z={3}>
      <pointLight intensity={5.2} color={0xffffff} position={[-2, 0, 0]} />
      <GateSide />
      <GateHUD intro={introAnim} gateLvl={gateLvl} />
      <GateMiddleObject intro={introAnim} gateLvl={gateLvl} />
    </group>
  );
};
export default GateScene;
