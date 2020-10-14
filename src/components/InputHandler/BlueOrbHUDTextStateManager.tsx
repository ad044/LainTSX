import React, { useCallback, useEffect, useMemo } from "react";
import blue_orb_huds from "../../resources/blue_orb_huds.json";
import site_a from "../../resources/site_a.json";
import { useSetRecoilState } from "recoil";
import { bigHudTextAtom } from "../HUD/HUDElementAtom";
import { useBlueOrbStore } from "../store";

const BlueOrbHUDTextStateManager = (props: any) => {
  const currentBlueOrbHudId = useBlueOrbStore((state) => state.hudId);
  const currentBlueOrbId = useBlueOrbStore((state) => state.blueOrbId);
  const setYellowHudText = useBlueOrbStore((state) => state.setYellowHudText);
  const setYellowHudTextOffsetXCoeff = useBlueOrbStore(
    (state) => state.setYellowHudTextOffsetXCoeff
  );

  const incrementYellowHudTextPosY = useBlueOrbStore(
    (state) => state.incrementYellowHudTextPosY
  );
  const setYellowHudTextPosY = useBlueOrbStore(
    (state) => state.setYellowHudTextPosY
  );
  const setYellowHudTextPosX = useBlueOrbStore(
    (state) => state.setYellowHudTextPosX
  );

  const animateYellowTextWithMove = useCallback(
    (
      targetBlueOrbHudId: string,
      targetBlueOrbId: string,
      yellowLetterPosYOffset: number
    ) => {
      // animate the letters to match that of site's
      // to create an illusion of not moving
      setTimeout(() => {
        incrementYellowHudTextPosY(yellowLetterPosYOffset);
      }, 1300);

      setTimeout(() => {
        // make current hud big text shrink
        setYellowHudTextOffsetXCoeff(-1);
      }, 2500);

      setTimeout(() => {
        // animate it to new pos x/y
        setYellowHudTextPosX(
          blue_orb_huds[currentBlueOrbHudId as keyof typeof blue_orb_huds]
            .big_text[0]
        );
        setYellowHudTextPosY(
          blue_orb_huds[currentBlueOrbHudId as keyof typeof blue_orb_huds]
            .big_text[1]
        );
        // set new text according to the node name
        setYellowHudText(
          site_a[currentBlueOrbId as keyof typeof site_a].node_name
        );
      }, 3000);

      // unshrink text
      setTimeout(() => {
        setYellowHudTextOffsetXCoeff(0);
      }, 3900);
    },
    [
      currentBlueOrbHudId,
      currentBlueOrbId,
      incrementYellowHudTextPosY,
      setYellowHudText,
      setYellowHudTextOffsetXCoeff,
      setYellowHudTextPosX,
      setYellowHudTextPosY,
    ]
  );

  const animateYellowTextWithoutMove = useCallback(
    (targetBlueOrbHudId: string, targetBlueOrbId: string) => {
      // make current hud big text shrink
      setYellowHudTextOffsetXCoeff(-1);

      setTimeout(() => {
        // animate it to new pos x/y
        setYellowHudTextPosX(
          blue_orb_huds[currentBlueOrbHudId as keyof typeof blue_orb_huds]
            .big_text[0]
        );
        setYellowHudTextPosY(
          blue_orb_huds[currentBlueOrbHudId as keyof typeof blue_orb_huds]
            .big_text[1]
        );
      }, 400);

      setTimeout(() => {
        // set new text according to the node name
        setYellowHudText(
          site_a[currentBlueOrbId as keyof typeof site_a].node_name
        );
      }, 1000);

      setTimeout(() => {
        // unshrink text
        setYellowHudTextOffsetXCoeff(0);
      }, 1200);
    },
    [
      currentBlueOrbHudId,
      currentBlueOrbId,
      setYellowHudText,
      setYellowHudTextOffsetXCoeff,
      setYellowHudTextPosX,
      setYellowHudTextPosY,
    ]
  );

  const dispatcherObjects = useMemo(
    () => ({
      moveUp: {
        action: "animateWithMove",
        actionFunction: animateYellowTextWithMove,
        yellowLetterPosYOffset: -1.5,
      },
      moveDown: {
        action: "animateWithMove",
        actionFunction: animateYellowTextWithMove,
        yellowLetterPosYOffset: 1.5,
      },
      moveLeft: {
        action: "animateWithMove",
        actionFunction: animateYellowTextWithMove,
        yellowLetterPosYOffset: 0,
      },
      moveRight: {
        action: "animateWithMove",
        actionFunction: animateYellowTextWithMove,
        yellowLetterPosYOffset: 0,
      },
      changeBlueOrbUp: {
        action: "animateWithoutMove",
        actionFunction: animateYellowTextWithoutMove,
        yellowLetterPosYOffset: 0,
      },
      changeBlueOrbDown: {
        action: "animateWithoutMove",
        actionFunction: animateYellowTextWithoutMove,
        yellowLetterPosYOffset: 0,
      },
      changeBlueOrbLeft: {
        action: "animateWithoutMove",
        actionFunction: animateYellowTextWithoutMove,
        yellowLetterPosYOffset: 0,
      },
      changeBlueOrbRight: {
        action: "animateWithoutMove",
        actionFunction: animateYellowTextWithoutMove,
        yellowLetterPosYOffset: 0,
      },
    }),
    [animateYellowTextWithMove, animateYellowTextWithoutMove]
  );

  useEffect(() => {
    if (props.eventState) {
      const targetBlueOrbId = props.targetBlueOrbId;
      const targetBlueOrbHudId = props.targetBlueOrbHudId;

      const dispatchedAction =
        dispatcherObjects[props.eventState as keyof typeof dispatcherObjects];

      if (dispatchedAction.action === "animateWithMove") {
        animateYellowTextWithMove(
          targetBlueOrbHudId,
          targetBlueOrbId,
          dispatchedAction.yellowLetterPosYOffset
        );
      } else {
        animateYellowTextWithoutMove(targetBlueOrbHudId, targetBlueOrbId);
      }
    }
  }, [
    animateYellowTextWithMove,
    animateYellowTextWithoutMove,
    dispatcherObjects,
    props.eventState,
    props.targetBlueOrbHudId,
    props.targetBlueOrbId,
  ]);

  return null;
};

export default BlueOrbHUDTextStateManager;
