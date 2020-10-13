import React, { useCallback, useEffect, useMemo } from "react";
import blue_orb_huds from "../../resources/blue_orb_huds.json";
import site_a from "../../resources/site_a.json";
import { useSetRecoilState } from "recoil";
import { bigLetterOffsetXCoeffAtom } from "../TextRenderer/TextRendererAtom";
import {
  bigHudTextAtom,
  bigLetterPosXAtom,
  bigLetterPosYAtom,
} from "../HUD/HUDElementAtom";

const BlueOrbHUDTextStateManager = (props: any) => {
  const setBigLetterOffSetXCoeff = useSetRecoilState(bigLetterOffsetXCoeffAtom);
  const setBigLetterPosY = useSetRecoilState(bigLetterPosYAtom);
  const setBigLetterPosX = useSetRecoilState(bigLetterPosXAtom);
  const setBigHudText = useSetRecoilState(bigHudTextAtom);

  const animateBigTextWithMove = useCallback(
    (
      targetBlueOrbHudId: string,
      targetBlueOrbId: string,
      bigLetterPosYOffset: number
    ) => {
      // animate the letters to match that of site's
      // to create an illusion of not moving
      setTimeout(() => {
        setBigLetterPosY((prev: number) => prev + bigLetterPosYOffset);
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
        setBigHudText(site_a[targetBlueOrbId as keyof typeof site_a].node_name);
      }, 3000);

      // unshrink text
      setTimeout(() => {
        setBigLetterOffSetXCoeff(0);
      }, 3900);
    },
    [
      setBigHudText,
      setBigLetterOffSetXCoeff,
      setBigLetterPosX,
      setBigLetterPosY,
    ]
  );

  const animateBigTextWithoutMove = useCallback(
    (targetBlueOrbHudId: string, targetBlueOrbId: string) => {
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
        setBigHudText(site_a[targetBlueOrbId as keyof typeof site_a].node_name);
      }, 1000);

      setTimeout(() => {
        // unshrink text
        setBigLetterOffSetXCoeff(0);
      }, 1200);
    },
    [
      setBigHudText,
      setBigLetterOffSetXCoeff,
      setBigLetterPosX,
      setBigLetterPosY,
    ]
  );

  const dispatcherObjects = useMemo(
    () => ({
      moveUp: {
        action: "animateWithMove",
        animation: animateBigTextWithMove,
        bigLetterPosYOffset: -1.5,
      },
      moveDown: {
        action: "animateWithMove",
        animation: animateBigTextWithMove,
        bigLetterPosYOffset: 1.5,
      },
      rotateLeft: {
        action: "animateWithMove",
        animation: animateBigTextWithMove,
        bigLetterPosYOffset: 0,
      },
      rotateRight: {
        action: "animateWithMove",
        animation: animateBigTextWithMove,
        bigLetterPosYOffset: 0,
      },
      changeBlueOrbUp: {
        action: "animateWithMove",
        animation: animateBigTextWithoutMove,
        bigLetterPosYOffset: 0,
      },
      changeBlueOrbDown: {
        action: "animateWithMove",
        animation: animateBigTextWithoutMove,
        bigLetterPosYOffset: 0,
      },
      changeBlueOrbLeft: {
        action: "animateWithMove",
        animation: animateBigTextWithoutMove,
        bigLetterPosYOffset: 0,
      },
      changeBlueOrbRight: {
        action: "animateWithMove",
        animation: animateBigTextWithoutMove,
        bigLetterPosYOffset: 0,
      },
    }),
    [animateBigTextWithMove, animateBigTextWithoutMove]
  );

  useEffect(() => {
    if (props.eventState) {
      const targetBlueOrbId = props.targetBlueOrbId;
      const targetBlueOrbHudId = props.targetBlueOrbHudId;

      const dispatchedAction =
        dispatcherObjects[props.eventState as keyof typeof dispatcherObjects];

      if (dispatchedAction.action === "animateWithMove") {
        animateBigTextWithMove(
          targetBlueOrbHudId,
          targetBlueOrbId,
          dispatchedAction.bigLetterPosYOffset
        );
      } else {
        animateBigTextWithoutMove(targetBlueOrbHudId, targetBlueOrbId);
      }
    }
  }, [
    animateBigTextWithMove,
    animateBigTextWithoutMove,
    dispatcherObjects,
    props.eventState,
    props.targetBlueOrbHudId,
    props.targetBlueOrbId,
    setBigHudText,
    setBigLetterOffSetXCoeff,
    setBigLetterPosX,
    setBigLetterPosY,
  ]);

  return null;
};

export default BlueOrbHUDTextStateManager;
