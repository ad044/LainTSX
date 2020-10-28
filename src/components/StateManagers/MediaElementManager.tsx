import { useCallback, useEffect } from "react";

import { StateManagerProps } from "./EventManager";
import game_action_mappings from "../../resources/game_action_mappings.json";
import blue_orb_directions from "../../resources/blue_orb_directions.json";

const MediaComponentManager = (props: StateManagerProps) => {
  const playMedia = useCallback(() => {
    const mediaElement = document.getElementById("media") as HTMLMediaElement;
    if (mediaElement) mediaElement.play().then((r) => console.log(r));
  }, []);

  const dispatchObject = useCallback(
    (event: string) => {
      const dispatcherObjects = {
        play_media_element: { action: playMedia },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [playMedia]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventObject: any =
        game_action_mappings[
          props.eventState as keyof typeof blue_orb_directions
        ];

      if (eventObject) {
        const eventAction = eventObject.action;

        const dispatchedObject = dispatchObject(eventAction);

        if (dispatchedObject) {
          dispatchedObject.action();
        }
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default MediaComponentManager;
