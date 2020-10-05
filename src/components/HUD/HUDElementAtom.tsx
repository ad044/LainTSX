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
  default: (blue_orb_huds as BlueOrbHuds)["22"],
});

export const bigLetterPosYAtom = atom({
  key: "bigLetterPosYAtom",
  default: (blue_orb_huds as BlueOrbHuds)["22"]["big_text"][1],
});

export const bigLetterPosXAtom = atom({
  key: "bigLetterPosXAtom",
  default: (blue_orb_huds as BlueOrbHuds)["22"]["big_text"][0],
});

export const bigHudTextAtom = atom({
  key: "bigHudTextAtom",
  default: "Tda031",
})