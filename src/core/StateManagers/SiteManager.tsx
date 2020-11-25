import { useCallback, useEffect, useMemo } from "react";
import { useSiteStore } from "../../store";
import { StateManagerProps } from "./EventManager";

const SiteManager = (props: StateManagerProps) => {
  const setTransformState = useSiteStore((state) => state.setTransformState);

  const dispatchObject = useCallback(
    (event: string, newSitePosY: number, newSiteRotY: number) => {
      switch (event) {
        case "move_up":
        case "move_down":
          return {
            action: setTransformState,
            value: [newSitePosY, "posY"],
            actionDelay: 1300,
          };
        case "move_left":
        case "move_right":
          return {
            action: setTransformState,
            value: [newSiteRotY, "rotY"],
            actionDelay: 1100,
          };
      }
    },
    [setTransformState]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newSiteRotY = props.eventState.newSiteRotY;
      const newSitePosY = props.eventState.newSitePosY;

      const dispatchedObject = dispatchObject(
        eventAction,
        newSitePosY,
        newSiteRotY
      );

      if (dispatchedObject) {
        setTimeout(() => {
          dispatchedObject.action.apply(null, dispatchedObject.value as any);
        }, dispatchedObject.actionDelay);
      }
    }
  }, [dispatchObject, props.eventState]);
  return null;
};

export default SiteManager;
