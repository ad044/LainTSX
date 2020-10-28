import { useEffect, useMemo } from "react";
import { useSiteStore } from "../../store";
import game_action_mappings from "../../resources/game_action_mappings.json";
import { StateManagerProps } from "./EventManager";

const SiteManager = (props: StateManagerProps) => {
  const incrementSiteRotY = useSiteStore((state) => state.incrementSiteRotY);
  const incrementSitePosY = useSiteStore((state) => state.incrementSitePosY);
  const setIsSiteYChanging = useSiteStore((state) => state.setIsSiteChanging);

  const dispatcherObjects = useMemo(
    () => ({
      move_up: { action: incrementSitePosY, value: -1.5, actionDelay: 1300 },
      move_down: { action: incrementSitePosY, value: 1.5, actionDelay: 1300 },
      move_left: {
        action: incrementSiteRotY,
        value: Math.PI / 4,
        actionDelay: 1100,
      },
      move_right: {
        action: incrementSiteRotY,
        value: -Math.PI / 4,
        actionDelay: 1100,
      },
    }),
    [incrementSitePosY, incrementSiteRotY]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventObject =
        game_action_mappings[
          props.eventState as keyof typeof game_action_mappings
        ];

      if (eventObject) {
        const eventAction = eventObject.action;

        const dispatchedObject =
          dispatcherObjects[eventAction as keyof typeof dispatcherObjects];

        if (dispatchedObject) {
          setIsSiteYChanging(true);

          setTimeout(() => {
            dispatchedObject.action(dispatchedObject.value);
          }, dispatchedObject.actionDelay);

          setTimeout(() => {
            setIsSiteYChanging(false);
          }, 3000);
        }
      }
    }
  }, [dispatcherObjects, props.eventState, setIsSiteYChanging]);
  return null;
};

export default SiteManager;
