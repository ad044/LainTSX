import React, { useEffect, useMemo } from "react";
import { useSiteStore } from "../../store";

const SiteStateManager = (props: any) => {
  const incrementSiteRotY = useSiteStore((state) => state.incrementSiteRotY);
  const incrementSitePosY = useSiteStore((state) => state.incrementSitePosY);
  const setIsSiteYChanging = useSiteStore((state) => state.setIsSiteChanging);

  const dispatcherObjects = useMemo(
    () => ({
      moveUp: { action: incrementSitePosY, value: -1.5, actionDelay: 1300 },
      moveDown: { action: incrementSitePosY, value: 1.5, actionDelay: 1300 },
      moveLeft: {
        action: incrementSiteRotY,
        value: Math.PI / 4,
        actionDelay: 1100,
      },
      moveRight: {
        action: incrementSiteRotY,
        value: -Math.PI / 4,
        actionDelay: 1100,
      },
    }),
    [incrementSitePosY, incrementSiteRotY]
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedAction =
        dispatcherObjects[props.eventState as keyof typeof dispatcherObjects];

      if (dispatchedAction) {
        setIsSiteYChanging(true);

        setTimeout(() => {
          dispatchedAction.action(dispatchedAction.value);
        }, dispatchedAction.actionDelay);

        setTimeout(() => {
          setIsSiteYChanging(false);
        }, 3000);
      }
    }
  }, [dispatcherObjects, props.eventState, setIsSiteYChanging]);
  return null;
};

export default SiteStateManager;
