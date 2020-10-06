import { atom } from "recoil";

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
