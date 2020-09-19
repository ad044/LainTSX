import { atom } from "recoil";

export const camPosYAtom = atom({
  key: "camPosYAtom",
  // default: -1.87,
  default: 0,
});

export const camRotYAtom = atom({
  key: "camRotYAtom",
  // default: 0.45,
  default: 0,
});
