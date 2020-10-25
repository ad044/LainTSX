import React from "react";
import PurpleRing from "./PurpleRing";
import GrayRing from "./GrayRing";
import CyanCrystal from "./CyanCrystal";

//constructor for levels
type LevelProps = {
  levelPosY: number;
  level: string;
};

const Level = (props: LevelProps) => {
  return (
    <group position={[0, props.levelPosY, 0]}>
      <PurpleRing purpleRingPosY={0.44} level={props.level} />
      <GrayRing grayRingPosY={-0.29} />
      <CyanCrystal crystalRingPosY={-0.45} />
    </group>
  );
};

export default Level;
