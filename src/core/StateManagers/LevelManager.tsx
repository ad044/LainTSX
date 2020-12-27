import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useLevelStore, useSiteSaveStore } from "../../store";

const LevelManager = (props: StateManagerProps) => {
  const setActiveLevel = useLevelStore((state) => state.setActiveLevel);
  const siteASaveState = useSiteSaveStore((state) => state.a);
  const siteBSaveState = useSiteSaveStore((state) => state.b);

  const dispatchObject = useCallback(
    (event: string, newLevel: string, newSite: string) => {
      switch (event) {
        case "site_up":
        case "site_down":
          return {
            action: setActiveLevel,
            value: newLevel,
            delay: 0,
          };
        case "select_level_down":
        case "select_level_up":
          return {
            action: setActiveLevel,
            value: newLevel,
            delay: 1500,
          };
        case "pause_change_select":
          return {
            action: setActiveLevel,
            value:
              newSite === "a" ? siteASaveState.level : siteBSaveState.level,
            delay: 0,
          };
      }
    },
    [setActiveLevel, siteASaveState.level, siteBSaveState.level]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newLevel = props.eventState.newLevel;
      const newSite = props.eventState.newSite;

      const dispatchedObject = dispatchObject(eventAction, newLevel, newSite);

      if (dispatchedObject) {
        setTimeout(() => {
          dispatchedObject.action(dispatchedObject.value as any);
        }, dispatchedObject.delay);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default LevelManager;
