import React, { useCallback, useEffect } from "react";
import blue_orb_huds from "../../resources/blue_orb_huds.json";
import site_a from "../../resources/site_a.json";
import { useBlueOrbStore } from "../../store";
import blue_orb_directions from "../../resources/blue_orb_directions.json";

type AnimateYellowTextWithMove = (
  yellowLetterPosYOffset: number,
  targetBlueOrbHudId: string,
  targetBlueOrbId: string
) => void;

type AnimateYellowTextWithoutMove = (
  targetBlueOrbHudId: string,
  targetBlueOrbId: string
) => void;

type BlueOrbHUDTextDispatchData = {
  action: AnimateYellowTextWithMove | AnimateYellowTextWithoutMove;
  value: any;
};

type BlueOrbHUDTextDispatcher = {
  moveUp: BlueOrbHUDTextDispatchData;
  moveDown: BlueOrbHUDTextDispatchData;
  moveLeft: BlueOrbHUDTextDispatchData;
  moveRight: BlueOrbHUDTextDispatchData;
  changeBlueOrbFocus: BlueOrbHUDTextDispatchData;
};

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

  const animateYellowTextWithMove: AnimateYellowTextWithMove = useCallback(
    (
      yellowLetterPosYOffset: number,
      targetBlueOrbHudId: string,
      targetBlueOrbId: string
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
          blue_orb_huds[targetBlueOrbHudId as keyof typeof blue_orb_huds]
            .big_text[0]
        );
        setYellowHudTextPosY(
          blue_orb_huds[targetBlueOrbHudId as keyof typeof blue_orb_huds]
            .big_text[1]
        );
        // set new text according to the node name
        setYellowHudText(
          site_a[targetBlueOrbId as keyof typeof site_a].node_name
        );
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

  const animateYellowTextWithoutMove: AnimateYellowTextWithoutMove = useCallback(
    (targetBlueOrbHudId: string, targetBlueOrbId: string) => {
      // make current hud big text shrink
      setYellowHudTextOffsetXCoeff(-1);

      setTimeout(() => {
        setYellowHudTextPosX(
          blue_orb_huds[targetBlueOrbHudId as keyof typeof blue_orb_huds]
            .big_text[0]
        );
        setYellowHudTextPosY(
          blue_orb_huds[targetBlueOrbHudId as keyof typeof blue_orb_huds]
            .big_text[1]
        );
      }, 400);
      // animate it to new pos x/y

      setTimeout(() => {
        // set new text according to the node name
        setYellowHudText(
          site_a[targetBlueOrbId as keyof typeof site_a].node_name
        );
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

  const dispatchObject = useCallback(
    (event: string, targetBlueOrbHudId: string, targetBlueOrbId: string) => {
      const dispatcherObjects: BlueOrbHUDTextDispatcher = {
        moveUp: {
          action: animateYellowTextWithMove,
          value: [-1.5, targetBlueOrbHudId, targetBlueOrbId],
        },
        moveDown: {
          action: animateYellowTextWithMove,
          value: [1.5, targetBlueOrbHudId, targetBlueOrbId],
        },
        moveLeft: {
          action: animateYellowTextWithMove,
          value: [targetBlueOrbHudId, targetBlueOrbId],
        },
        moveRight: {
          action: animateYellowTextWithMove,
          value: [targetBlueOrbHudId, targetBlueOrbId],
        },
        changeBlueOrbFocus: {
          action: animateYellowTextWithoutMove,
          value: [targetBlueOrbHudId, targetBlueOrbId],
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [animateYellowTextWithMove, animateYellowTextWithoutMove]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventObject =
        blue_orb_directions[
          props.eventState as keyof typeof blue_orb_directions
        ];

      if (eventObject) {
        const eventAction = eventObject.action;
        const targetBlueOrbId = eventObject.target_blue_orb_id;
        const targetBlueOrbHudId = eventObject.target_hud_id;

        const dispatchedObject = dispatchObject(
          eventAction,
          targetBlueOrbHudId,
          targetBlueOrbId
        );

        if (dispatchedObject) {
          (dispatchedObject.action as any).apply(null, dispatchedObject.value);
        }
      }
    }
  }, [
    animateYellowTextWithMove,
    animateYellowTextWithoutMove,
    props.eventState,
    props.targetBlueOrbHudId,
    props.targetBlueOrbId,
    dispatchObject,
  ]);

  return null;
};

export default BlueOrbHUDTextStateManager;
