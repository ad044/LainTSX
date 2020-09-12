import { atom } from "recoil";

export const hudActiveAtom = atom({
  key: "hudActiveAtom",
  default: 1,
});

export const hudVisibilityAtom = atom({
  key: "hudVisibilityAtom",
  default: false,
});
