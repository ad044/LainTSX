import {atom} from "recoil";
import level_sprite_huds from "../../resources/level_sprite_huds.json";
import {SpriteHuds} from "./HUDElement";

export const currentHUDAtom = atom({
  key: "currentHUDAtom",
  default: (level_sprite_huds as SpriteHuds)["22"],
});
