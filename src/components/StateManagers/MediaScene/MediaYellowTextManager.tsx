import React, { useCallback, useEffect } from "react";
import { useTextRendererStore } from "../../../store";

type AnimateMediaYellowText = (
  targetMediaText: string,
  targetMediaTextPos: number[]
) => void;

type YellowTextDispatchData = {
  action: AnimateMediaYellowText;
  value: any;
};

type YellowTextDispatcher = {
  play_down: YellowTextDispatchData;
  exit_up: YellowTextDispatchData;
};

const MediaYellowTextManager = (props: any) => {
  const setYellowText = useTextRendererStore((state) => state.setYellowText);

  const setYellowTextOffsetXCoeff = useTextRendererStore(
    (state) => state.setYellowTextOffsetXCoeff
  );

  const setYellowTextPosY = useTextRendererStore(
    (state) => state.setYellowTextPosY
  );
  const setYellowTextPosX = useTextRendererStore(
    (state) => state.setYellowTextPosX
  );

  const animateMediaYellowText: AnimateMediaYellowText = useCallback(
    (targetMediaComponentText: string, targetMediaComponentTextPos: number[]) => {
      // make current text shrink
      setYellowTextOffsetXCoeff(-1);

      setTimeout(() => {
        setYellowTextPosX(targetMediaComponentTextPos[0]);
        setYellowTextPosY(targetMediaComponentTextPos[1]);
      }, 400);

      setTimeout(() => {
        setYellowText(targetMediaComponentText);
      }, 1000);

      setTimeout(() => {
        // unshrink text
        setYellowTextOffsetXCoeff(0);
      }, 1200);
    },
    [
      setYellowText,
      setYellowTextOffsetXCoeff,
      setYellowTextPosX,
      setYellowTextPosY,
    ]
  );

  const dispatchObject = useCallback(
    (event: string) => {
      const dispatcherObjects: YellowTextDispatcher = {
        exit_up: {
          action: animateMediaYellowText,
          value: ["Play", [-0.8, 0.05, 0.6]],
        },
        play_down: {
          action: animateMediaYellowText,
          value: ["Exit", [-0.8, -0.08, 0.6]],
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [animateMediaYellowText]
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedObject = dispatchObject(props.eventState);
      if (dispatchedObject) {
        (dispatchedObject.action as any).apply(null, dispatchedObject.value);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default MediaYellowTextManager;
