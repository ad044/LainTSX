import { atom } from "recoil";

export const currentBlueOrbAtom = atom({
  key: "currentBlueOrbAtom",
  default: "0422",
});

export const currentBlueOrbAnimatingAtom = atom({
  key: "currentBlueOrbAnimatingAtom",
  default: false,
});

export const currentBlueOrbPosXAtom = atom({
  key: "currentBlueOrbPosXAtom",
  default: 0,
});

export const currentBlueOrbPosYAtom = atom({
  key: "currentBlueOrbPosYAtom",
  default: 0,
});

export const currentBlueOrbPosZAtom = atom({
  key: "currentBlueOrbPosZAtom",
  default: 0,
});
