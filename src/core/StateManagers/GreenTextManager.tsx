import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import node_huds from "../../resources/node_huds.json";
import site_a from "../../resources/site_a.json";
import { SiteType } from "../../components/MainScene/Site";
import { useGreenTextStore } from "../../store";

const GreenTextManager = (props: StateManagerProps) => {
  const setGreenText = useGreenTextStore((state) => state.setText);
  const toggleActive = useGreenTextStore((state) => state.toggleActive);
  const setTransformState = useGreenTextStore(
    (state) => state.setTransformState
  );

  const toggleAndSetGreenText = useCallback(
    (
      newActiveNodeId: string,
      newActiveHudId: string,
      newLevel: string,
      delay: number
    ) => {
      const targetGreenText = (site_a as SiteType)[newLevel][newActiveNodeId]
        .title;

      const targetGreenTextPosData =
        node_huds[newActiveHudId as keyof typeof node_huds].medium_text;

      toggleActive();

      setTimeout(() => {
        setTransformState(
          {
            initial: targetGreenTextPosData.initial_position[0],
            final: targetGreenTextPosData.position[0],
          },
          "posX"
        );
        setTransformState(targetGreenTextPosData.position[1], "posY");
        setGreenText(targetGreenText);
        toggleActive();
      }, delay);
    },
    [setGreenText, setTransformState, toggleActive]
  );

  const initializeGreenTextForMediaScene = useCallback(
    (activeNodeId: string, level: string) => {
      setTimeout(() => {
        setGreenText((site_a as SiteType)[level][activeNodeId].node_name);
        setTransformState(
          {
            initial: 0,
            final: 0.009,
          },
          "posX"
        );
        setTransformState(0.675, "posY");
      }, 3950);
    },
    [setGreenText, setTransformState]
  );

  const dispatchObject = useCallback(
    (
      event: string,
      newActiveNodeId: string,
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
            value: [newActiveNodeId, newActiveHudId, newLevel, 3903.704],
          };
        case "change_node":
          return {
            action: toggleAndSetGreenText,
            value: [newActiveNodeId, newActiveHudId, newLevel, 500],
          };
        case "throw_node_media":
          return {
            action: initializeGreenTextForMediaScene,
            value: [newActiveNodeId, newLevel],
          };
        case "toggle_level_selection":
          return {
            action: toggleActive,
          };
      }
    },
    [initializeGreenTextForMediaScene, toggleActive, toggleAndSetGreenText]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newActiveNodeId = props.eventState.newActiveNodeId;
      const newActiveHudId = props.eventState.newActiveHudId;
      const newLevel = props.eventState.newLevel;

      const dispatchedObject = dispatchObject(
        eventAction,
        newActiveNodeId,
        newActiveHudId,
        newLevel
      );

      if (dispatchedObject) {
        (dispatchedObject.action as any).apply(
          null,
          dispatchedObject.value as any
        );
      }
    }
  }, [props.eventState, dispatchObject]);
  return null;
};

export default GreenTextManager;
