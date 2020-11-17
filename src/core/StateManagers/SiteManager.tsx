import { useCallback, useEffect, useMemo } from "react";
import { useSiteStore } from "../../store";
import { StateManagerProps } from "./EventManager";

const SiteManager = (props: StateManagerProps) => {
  const addToSiteRotY = useSiteStore((state) => state.addToSiteRotY);
  const addToSitePosY = useSiteStore((state) => state.addToSitePosY);
  const setSiteRotIdx = useSiteStore((state) => state.setSiteRotIdx);
  const setIsSiteYChanging = useSiteStore((state) => state.setIsSiteChanging);

  const rotateSite = useCallback(
    (value: number, newSiteRotIdx: string) => {
      addToSiteRotY(value);
      setSiteRotIdx(newSiteRotIdx);
    },
    [addToSiteRotY, setSiteRotIdx]
  );

  const dispatchObject = useCallback(
    (event: string, newSiteRotIdx: string) => {
      switch (event) {
        case "move_up":
          return {
            action: addToSitePosY,
            value: [-1.5],
            actionDelay: 1300,
          };
        case "move_down":
          return {
            action: addToSitePosY,
            value: [1.5],
            actionDelay: 1300,
          };
        case "move_left":
          return {
            action: rotateSite,
            value: [Math.PI / 4, newSiteRotIdx],
            actionDelay: 1100,
          };
        case "move_right":
          return {
            action: rotateSite,
            value: [-Math.PI / 4, newSiteRotIdx],
            actionDelay: 1100,
          };
      }
    },
    [addToSitePosY, rotateSite]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newSiteRotIdx = props.eventState.newSiteRotIdx;

      const dispatchedObject = dispatchObject(eventAction, newSiteRotIdx);
      if (dispatchedObject) {
        setIsSiteYChanging(true);

        setTimeout(() => {
          (dispatchedObject.action as any).apply(null, dispatchedObject.value);
        }, dispatchedObject.actionDelay);

        setTimeout(() => {
          setIsSiteYChanging(false);
        }, 3000);
      }
    }
  }, [dispatchObject, props.eventState, setIsSiteYChanging]);
  return null;
};

export default SiteManager;
