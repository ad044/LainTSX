import React, { useEffect } from "react";
import blue_orb_huds from "../../resources/blue_orb_huds.json";
import site_a from "../../resources/site_a.json";
import { useSetRecoilState } from "recoil";
import { bigLetterOffsetXCoeffAtom } from "../TextRenderer/TextRendererAtom";
import {
  bigHudTextAtom,
  bigLetterPosXAtom,
  bigLetterPosYAtom,
} from "../HUD/HUDElementAtom";
import { SiteData } from "../Site/Site";
import { StateManagerProps } from "./InputHandler";

const HUDTextStateManager = (props: StateManagerProps) => {
  const setBigLetterOffSetXCoeff = useSetRecoilState(bigLetterOffsetXCoeffAtom);
  const setBigLetterPosY = useSetRecoilState(bigLetterPosYAtom);
  const setBigLetterPosX = useSetRecoilState(bigLetterPosXAtom);
  const setBigHudText = useSetRecoilState(bigHudTextAtom);

  useEffect(() => {
    if (props.eventState) {
      const targetBlueOrbId = props.eventState.targetBlueOrbId;
      const targetBlueOrbHudId = props.eventState.targetBlueOrbHudId;
      const moveDirection = props.eventState.moveDirection;

      if (moveDirection) {
        // animate the letters to match that of site's
        // to create an illusion of not moving
        setTimeout(() => {
          switch (moveDirection) {
            case "up":
              setBigLetterPosY((prev: number) => prev - 1.5);
              break;
            case "down":
              setBigLetterPosY((prev: number) => prev + 1.5);
              break;
            default:
              break;
          }
        }, 1300);

        setTimeout(() => {
          // make current hud big text shrink
          setBigLetterOffSetXCoeff(-1);
        }, 2500);

        setTimeout(() => {
          // animate it to new pos x/y
          setBigLetterPosX(
            blue_orb_huds[targetBlueOrbHudId as keyof typeof blue_orb_huds]
              .big_text[0]
          );
          setBigLetterPosY(
            blue_orb_huds[targetBlueOrbHudId as keyof typeof blue_orb_huds]
              .big_text[1]
          );
          // set new text according to the node name
          setBigHudText((site_a as SiteData)[targetBlueOrbId].node_name);
        }, 3000);

        // unshrink text
        setTimeout(() => {
          setBigLetterOffSetXCoeff(0);
        }, 3900);
      } else {
        // make current hud big text shrink
        setBigLetterOffSetXCoeff(-1);

        setTimeout(() => {
          // animate it to new pos x/y
          setBigLetterPosX(
            blue_orb_huds[targetBlueOrbHudId as keyof typeof blue_orb_huds]
              .big_text[0]
          );
          setBigLetterPosY(
            blue_orb_huds[targetBlueOrbHudId as keyof typeof blue_orb_huds]
              .big_text[1]
          );
        }, 400);

        setTimeout(() => {
          // set new text according to the node name
          setBigHudText(
            site_a[targetBlueOrbId as keyof typeof site_a].node_name
          );
        }, 1000);

        setTimeout(() => {
          // unshrink text
          setBigLetterOffSetXCoeff(0);
        }, 1200);
      }
    }
  }, [
    props.eventState,
    setBigHudText,
    setBigLetterOffSetXCoeff,
    setBigLetterPosX,
    setBigLetterPosY,
  ]);

  return null;
};

export default HUDTextStateManager;
