import { atom } from "recoil";

export const grayPlanesPosYAtom = atom({
  key: "grayPlanesPosYAtom",
  default: -1,
});

export const grayPlanesVisibleAtom = atom({
  key: "grayPlanesVisibleAtom",
  default: false,
});
