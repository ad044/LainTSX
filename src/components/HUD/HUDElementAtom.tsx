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
