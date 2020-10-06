import { atom } from "recoil";
import React from "react";

export const lainMovingAtom = atom({
  key: "lainMovingAtom",
  default: false,
});

export const lainMoveStateAtom = atom({
  key: "lainMoveStateAtom",
  default: <></>,
});
