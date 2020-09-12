import { atom } from "recoil";

export const starfieldPosYAtom = atom({
  key: "starfieldPosYAtom",
  default: -1,
});

export const introStarfieldVisibilityAtom = atom({
  key: "introStarfieldVisibilityAtom",
  default: true,
});
