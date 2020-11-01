import { useCallback, useEffect } from "react";
import { useTextRendererStore } from "../../store";
import site_a from "../../resources/site_a.json";
import { StateManagerProps } from "./EventManager";
import blue_orb_huds from "../../resources/blue_orb_huds.json";

const GreenTextManager = (props: StateManagerProps) => {
  const setGreenText = useTextRendererStore((state) => state.setGreenText);
  const setGreenTextPosY = useTextRendererStore(
    (state) => state.setGreenTextPosY
  );
  const setGreenTextPosX = useTextRendererStore(
    (state) => state.setGreenTextPosX
  );
  const toggleGreenText = useTextRendererStore(
    (state) => state.toggleGreenText
  );

  const toggleAndSetGreenText = useCallback(
    (newActiveBlueOrbId: string, newActiveHudId: string, delay: number) => {
      const targetGreenText =
        site_a[newActiveBlueOrbId as keyof typeof site_a].title;

      const targetGreenTextPosData =
        blue_orb_huds[newActiveHudId as keyof typeof blue_orb_huds].medium_text;

      toggleGreenText();

      setTimeout(() => {
        setGreenTextPosX({
          initial: targetGreenTextPosData.initial_position[0],
          final: targetGreenTextPosData.position[0],
        });
        setGreenTextPosY(targetGreenTextPosData.position[1]);
        setGreenText(targetGreenText);
        toggleGreenText();
      }, delay);
    },
    [setGreenText, setGreenTextPosX, setGreenTextPosY, toggleGreenText]
  );

  const dispatchObject = useCallback(
    (event: string, newActiveBlueOrbId: string, newActiveHudId: string) => {
      const dispatcherObjects = {
        move_up: {
          action: toggleAndSetGreenText,
          value: [newActiveBlueOrbId, newActiveHudId, 3903.704],
        },
        move_down: {
          action: toggleAndSetGreenText,
          value: [newActiveBlueOrbId, newActiveHudId, 3903.704],
        },
        move_left: {
          action: toggleAndSetGreenText,
          value: [newActiveBlueOrbId, newActiveHudId, 3903.704],
        },
        move_right: {
          action: toggleAndSetGreenText,
          value: [newActiveBlueOrbId, newActiveHudId, 3903.704],
        },
        change_blue_orb: {
          action: toggleAndSetGreenText,
          value: [newActiveBlueOrbId, newActiveHudId, 500],
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [toggleAndSetGreenText]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newActiveBlueOrbId = props.eventState.newActiveBlueOrbId;
      const newActiveHudId = props.eventState.newActiveHudId;

      const dispatchedObject = dispatchObject(
        eventAction,
        newActiveBlueOrbId,
        newActiveHudId
      );

      if (dispatchedObject) {
        dispatchedObject.action.apply(null, dispatchedObject.value as any);
      }
    }
  }, [props.eventState, dispatchObject]);
  return null;
};

export default GreenTextManager;
