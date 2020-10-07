import { atom } from "recoil";

export const siteRotYAtom = atom({
  key: "siteRotYatom",
  default: 0,
});

export const sitePosYAtom = atom({
  key: "sitePosYAtom",
  default: 0,
});

export const isSiteYChangingAtom = atom({
  key: "isSiteYChangingAtom",
  default: false,
});
