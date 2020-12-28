import { useCallback, useEffect } from "react";
import { useSiteStore } from "../../../store";
import { StateManagerProps } from "../EventManager";

const SiteManager = (props: StateManagerProps) => {
  const setTransformState = useSiteStore((state) => state.setTransformState);

  const dispatchObject = useCallback(
    (eventState: {
      event: string;
      sitePosY: number;
      siteRotY: number;
    }) => {
      switch (eventState.event) {
        case "site_up":
        case "site_down":
        case "select_level_up":
        case "select_level_down":
          return {
            action: setTransformState,
            value: [eventState.sitePosY, "posY"],
            actionDelay: 1300,
          };
        case "site_left":
        case "site_right":
          return {
            action: setTransformState,
            value: [eventState.siteRotY, "rotY"],
            actionDelay: 1100,
          };
        case "pause_game":
          return {
            action: setTransformState,
            value: [Math.PI / 2, "rotX"],
            actionDelay: 0,
          };
        case "pause_exit_select":
          return {
            action: setTransformState,
            value: [0, "rotX"],
            actionDelay: 0,
          };
      }
    },
    [setTransformState]
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedObject = dispatchObject(props.eventState);

      if (dispatchedObject) {
        setTimeout(() => {
          (dispatchedObject.action as any).apply(
            null,
            dispatchedObject.value as any
          );
        }, dispatchedObject.actionDelay);
      }
    }
  }, [dispatchObject, props.eventState]);
  return null;
};

export default SiteManager;
