import { atom } from "recoil";

export const starfieldPosYAtom = atom({
  key: "starfieldPosYAtom",
  default: -1,
});

export const starfieldRotYAtom = atom({
  key: "starfieldRotYAtom",
  default: 0,
});

export const introStarfieldVisibilityAtom = atom({
  key: "introStarfieldVisibilityAtom",
  default: true,
});

export const mainStarfieldVisibilityAtom = atom({
  key: "mainStarfieldVisibilityAtom",
  default: false,
});

export const mainStarfieldBoostValAtom = atom({
  key: "mainStarfieldBoostVal",
  default: 0.2,
});
