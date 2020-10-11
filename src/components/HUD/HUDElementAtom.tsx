import { atom } from "recoil";
import blue_orb_huds from "../../resources/blue_orb_huds.json";
import { BlueOrbHuds } from "./HUDElement";

export const hudActiveAtom = atom({
  key: "hudActiveAtom",
  default: 1,
});

export const hudVisibilityAtom = atom({
  key: "hudVisibilityAtom",
  default: true,
});

export const currentHUDAtom = atom({
  key: "currentHUDAtom",
  default: (blue_orb_huds as BlueOrbHuds)["fg_hud_1"],
});

export const bigLetterPosYAtom = atom({
  key: "bigLetterPosYAtom",
  default: (blue_orb_huds as BlueOrbHuds)["fg_hud_1"]["big_text"][1],
});

export const bigLetterPosXAtom = atom({
  key: "bigLetterPosXAtom",
  default: (blue_orb_huds as BlueOrbHuds)["fg_hud_1"]["big_text"][0],
});

export const bigHudTextAtom = atom({
  key: "bigHudTextAtom",
  default: "Tda031",
});

export const mediumHudTextAtom = atom({
  key: "mediumHudTextAtom",
  default: "TOUKO's DIARY",
});

export const mediumHudTextPosYAtom = atom({
  key: "mediumHudTextPosYAtom",
  default: 0.16,
});

export const mediumHudTextPosXAtom = atom({
  key: "mediumHudTextPosXAtom",
  default: 0.18,
});
