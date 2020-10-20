import React, { useCallback, useEffect } from "react";
import { useTextRendererStore } from "../../store";
import blue_orb_directions from "../../resources/blue_orb_directions.json";
import site_a from "../../resources/site_a.json";
import { StateManagerProps } from "./EventStateManager";

const GreenTextStateManager = (props: StateManagerProps) => {
  const setGreenText = useTextRendererStore((state) => state.setGreenText);
  const toggleGreenText = useTextRendererStore(
    (state) => state.toggleGreenText
  );

  const toggleAndSetGreenText = useCallback(
    (targetBlueOrbId: string, delay: number) => {
      const targetGreenText =
        site_a[targetBlueOrbId as keyof typeof site_a].green_text;

      toggleGreenText();

      setTimeout(() => {
        setGreenText(targetGreenText);
        toggleGreenText();
      }, delay);
    },
    [setGreenText, toggleGreenText]
  );

  const dispatchObject = useCallback(
    (event: string, targetBlueOrbId: string) => {
      const dispatcherObjects = {
        moveUp: {
          action: toggleAndSetGreenText,
          value: [targetBlueOrbId, 3903.704],
        },
        moveDown: {
          action: toggleAndSetGreenText,
          value: [targetBlueOrbId, 3903.704],
        },
        moveLeft: {
          action: toggleAndSetGreenText,
          value: [targetBlueOrbId, 3903.704],
        },
        moveRight: {
          action: toggleAndSetGreenText,
          value: [targetBlueOrbId, 3903.704],
        },
        changeBlueOrbFocus: {
          action: toggleAndSetGreenText,
          value: [targetBlueOrbId, 500],
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [toggleAndSetGreenText]
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

        const dispatchedObject = dispatchObject(eventAction, targetBlueOrbId);

        if (dispatchedObject) {
          dispatchedObject.action.apply(null, dispatchedObject.value as any);
        }
      }
    }
  }, [props.eventState, dispatchObject]);
  return null;
};

export default GreenTextStateManager;
