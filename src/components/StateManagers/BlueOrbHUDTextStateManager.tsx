import React, { useCallback, useEffect, useMemo } from "react";
import blue_orb_huds from "../../resources/blue_orb_huds.json";
import site_a from "../../resources/site_a.json";
import { useBlueOrbStore } from "../../store";

const BlueOrbHUDTextStateManager = (props: any) => {
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
    (yellowLetterPosYOffset: number, targ1: string, targ2: string) => {
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
          blue_orb_huds[targ1 as keyof typeof blue_orb_huds].big_text[0]
        );
        setYellowHudTextPosY(
          blue_orb_huds[targ1 as keyof typeof blue_orb_huds].big_text[1]
        );
        // set new text according to the node name
        setYellowHudText(site_a[targ2 as keyof typeof site_a].node_name);
      }, 3000);

      // unshrink text
      setTimeout(() => {
        setYellowHudTextOffsetXCoeff(0);
      }, 3900);
    },
    [
      incrementYellowHudTextPosY,
      setYellowHudText,
      setYellowHudTextOffsetXCoeff,
      setYellowHudTextPosX,
      setYellowHudTextPosY,
    ]
  );

  const animateYellowTextWithoutMove = useCallback(
    (targ1: string, targ2: string) => {
      // make current hud big text shrink
      setYellowHudTextOffsetXCoeff(-1);

      setTimeout(() => {
        setYellowHudTextPosX(
          blue_orb_huds[targ1 as keyof typeof blue_orb_huds].big_text[0]
        );
        setYellowHudTextPosY(
          blue_orb_huds[targ1 as keyof typeof blue_orb_huds].big_text[1]
        );
      }, 400);
      // animate it to new pos x/y

      setTimeout(() => {
        // set new text according to the node name
        setYellowHudText(site_a[targ2 as keyof typeof site_a].node_name);
      }, 1000);

      setTimeout(() => {
        // unshrink text
        setYellowHudTextOffsetXCoeff(0);
      }, 1200);
    },
    [
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
      changeBlueOrbFocus: {
        action: "animateWithoutMove",
        actionFunction: animateYellowTextWithoutMove,
        yellowLetterPosYOffset: 0,
      },
    }),
    [animateYellowTextWithMove, animateYellowTextWithoutMove]
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedAction =
        dispatcherObjects[props.eventState as keyof typeof dispatcherObjects];

      if (dispatchedAction.action === "animateWithMove") {
        animateYellowTextWithMove(
          dispatchedAction.yellowLetterPosYOffset,
          props.targetBlueOrbHudId,
          props.targetBlueOrbId
        );
      } else {
        animateYellowTextWithoutMove(
          props.targetBlueOrbHudId,
          props.targetBlueOrbId
        );
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
