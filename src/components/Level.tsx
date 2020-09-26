import React from "react";
import PurpleRing from "./PurpleRing";
import GrayRing from "./GrayRing";
import CyanCrystal from "./CyanCrystal";

//constructor for levels
type LevelProps = {
  levelPosY: number;
};

const Level = (props: LevelProps) => {
  return (
    <group position={[0, props.levelPosY, 0]}>
      <PurpleRing purpleRingPosY={0.07} />
      <GrayRing grayRingPosY={-0.045} />
      <CyanCrystal crystalRingPosY={-0.45} />
    </group>
  );
};

export default Level;
