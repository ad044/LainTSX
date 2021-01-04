import React, { useMemo } from "react";
import { a } from "@react-spring/three";
import * as THREE from "three";
import ExplosionLine from "./NodeExplosion/ExplosionLine";

const NodeExplosion = () => {
  return <ExplosionLine rotation={[0, 0, -0.3]} color={"#f5cc16"} length={1} />;
};

export default NodeExplosion;
