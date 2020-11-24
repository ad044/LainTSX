import { useCallback, useEffect, useMemo } from "react";
import { useSiteStore } from "../../store";
import { StateManagerProps } from "./EventManager";

const SiteManager = (props: StateManagerProps) => {
  const setSiteRotY = useSiteStore((state) => state.setSiteRotY);
  const setSitePosY = useSiteStore((state) => state.setSitePosY);

  const dispatchObject = useCallback(
    (event: string, newSitePosY: number, newSiteRotY: number) => {
      switch (event) {
        case "move_up":
        case "move_down":
          return {
            action: setSitePosY,
            value: newSitePosY,
            actionDelay: 1300,
          };
        case "move_left":
        case "move_right":
          return {
            action: setSiteRotY,
            value: newSiteRotY,
            actionDelay: 1100,
          };
      }
    },
    [setSitePosY, setSiteRotY]
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
          dispatchedObject.action(dispatchedObject.value);
        }, dispatchedObject.actionDelay);
      }
    }
  }, [dispatchObject, props.eventState]);
  return null;
};

export default SiteManager;
