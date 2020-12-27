import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import node_huds from "../../resources/node_huds.json";
import site_a from "../../resources/site_a.json";
import { SiteType } from "../../components/MainScene/SyncedComponents/Site";
import { useGreenTextStore, useSiteStore } from "../../store";
import site_b from "../../resources/site_b.json";

const GreenTextManager = (props: StateManagerProps) => {
  const setGreenText = useGreenTextStore((state) => state.setText);
  const toggleActive = useGreenTextStore((state) => state.toggleActive);
  const setTransformState = useGreenTextStore(
    (state) => state.setTransformState
  );

  const currentSite = useSiteStore((state) => state.currentSite);

  const siteData = currentSite === "a" ? site_a : site_b;

  const toggleAndSetGreenText = useCallback(
    (
      newActiveNodeId: string,
      newActiveHudId: string,
      newLevel: string,
      delay: number,
      shouldToggleAtStart: boolean
    ) => {
      const targetGreenText =
        newActiveNodeId === "UNKNOWN"
          ? ""
          : (siteData as SiteType)[newLevel][newActiveNodeId].title;

      const targetGreenTextPosData =
        node_huds[newActiveHudId as keyof typeof node_huds].medium_text;

      if (shouldToggleAtStart) toggleActive();

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
    [setGreenText, setTransformState, siteData, toggleActive]
  );

  const dispatchObject = useCallback(
    (
      event: string,
      newActiveNodeId: string,
      newActiveHudId: string,
      newLevel: string
    ) => {
      switch (event) {
        case "site_up":
        case "site_down":
        case "site_left":
        case "site_right":
          return {
            action: toggleAndSetGreenText,
            value: [newActiveNodeId, newActiveHudId, newLevel, 3900, true],
          };
        case "change_node":
          return {
            action: toggleAndSetGreenText,
            value: [newActiveNodeId, newActiveHudId, newLevel, 500, true],
          };
        case "toggle_level_selection":
        case "level_selection_back":
          return {
            action: toggleActive,
          };
        case "select_level_up":
        case "select_level_down":
          return {
            action: toggleAndSetGreenText,
            value: [newActiveNodeId, newActiveHudId, newLevel, 3900, false],
          };
      }
    },
    [toggleActive, toggleAndSetGreenText]
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
