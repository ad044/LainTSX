import { atom } from "recoil";
import React from "react";

export const lainPosYAtom = atom({
  key: "lainPosYAtom",
  default: -0.02,
});

export const lainRotYAtom = atom({
  key: "lainRotYAtom",
  default: 0,
});

export const lainMovingAtom = atom({
  key: "lainMovingAtom",
  default: false,
});

export const lainMoveStateAtom = atom({
  key: "lainMoveStateAtom",
  default: <></>,
});
