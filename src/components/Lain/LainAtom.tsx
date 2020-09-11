import { atom } from "recoil";
import React from "react";

export const lainPosYAtom = atom({
  key: "lainPosYAtom",
  default: -0.15,
});

export const lainMovingAtom = atom({
  key: "lainMovingAtom",
  default: false,
});

export const lainMoveStateAtom = atom({
  key: "lainMoveStateAtom",
  default: <></>,
});
