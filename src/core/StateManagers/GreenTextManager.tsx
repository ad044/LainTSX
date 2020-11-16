import { useCallback, useEffect } from "react";
import { useTextRendererStore } from "../../store";
import { StateManagerProps } from "./EventManager";
import blue_orb_huds from "../../resources/blue_orb_huds.json";
import site_a from "../../resources/site_a.json";
import { SiteType } from "../../components/MainScene/Site";

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
    (
      newActiveBlueOrbId: string,
      newActiveHudId: string,
      newLevel: string,
      delay: number
    ) => {
      const targetGreenText = (site_a as SiteType)[newLevel][newActiveBlueOrbId]
        .title;

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

  const initializeGreenTextForMediaScene = useCallback(
    (activeBlueOrbId: string, level: string) => {
      setTimeout(() => {
        setGreenText((site_a as SiteType)[level][activeBlueOrbId].node_name);
        setGreenTextPosX({ initial: 0.0, final: 0.009 });
        setGreenTextPosY(0.675);
      }, 3950);
    },
    [setGreenText, setGreenTextPosX, setGreenTextPosY]
  );

  const dispatchObject = useCallback(
    (
      event: string,
      newActiveBlueOrbId: string,
      newActiveHudId: string,
      newLevel: string
    ) => {
      switch (event) {
        case "move_up":
        case "move_down":
        case "move_left":
        case "move_right":
          return {
            action: toggleAndSetGreenText,
            value: [newActiveBlueOrbId, newActiveHudId, newLevel, 3903.704],
          };
        case "change_blue_orb":
          return {
            action: toggleAndSetGreenText,
            value: [newActiveBlueOrbId, newActiveHudId, newLevel, 500],
          };
        case "throw_blue_orb_media":
          return {
            action: initializeGreenTextForMediaScene,
            value: [newActiveBlueOrbId, newLevel],
          };
      }
    },
    [initializeGreenTextForMediaScene, toggleAndSetGreenText]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newActiveBlueOrbId = props.eventState.newActiveBlueOrbId;
      const newActiveHudId = props.eventState.newActiveHudId;
      const newLevel = props.eventState.newLevel;

      const dispatchedObject = dispatchObject(
        eventAction,
        newActiveBlueOrbId,
        newActiveHudId,
        newLevel
      );

      if (dispatchedObject) {
        dispatchedObject.action.apply(null, dispatchedObject.value as any);
      }
    }
  }, [props.eventState, dispatchObject]);
  return null;
};

export default GreenTextManager;
