import React, { useCallback, useEffect } from "react";
import { useMediaStore } from "../../store";
import { StateManagerProps } from "./EventStateManager";
import media_scene_directions from "../../resources/media_scene_directions.json";

const ActiveMediaElementStateManager = (props: StateManagerProps) => {
  const setActiveMediaElement = useMediaStore(
    (state) => state.setActiveMediaElement
  );

  const dispatchObject = useCallback(
    (event: string, targetMediaElement: string) => {
      const dispatcherObjects = {
        setActivePlay: {
          action: setActiveMediaElement,
          value: targetMediaElement,
        },
        setActiveExit: {
          action: setActiveMediaElement,
          value: targetMediaElement,
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    []
  );

  useEffect(() => {
    if (props.eventState) {
      const eventObject =
        media_scene_directions[
          props.eventState as keyof typeof media_scene_directions
        ];

      if (eventObject) {
        const eventAction = eventObject.action;

        const targetMediaElement = eventObject.target_media_element;

        const dispatchedObject = dispatchObject(
          eventAction,
          targetMediaElement
        );

        if (dispatchedObject) {
          dispatchedObject.action(dispatchedObject.value);
        }
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default ActiveMediaElementStateManager;
