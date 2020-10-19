import React, { useCallback, useEffect } from "react";
import { useMediaStore } from "../../store";
import media_scene_directions from "../../resources/media_scene_directions.json";
import { StateManagerProps } from "./EventStateManager";

const MediaSceneStateManager = (props: StateManagerProps) => {
  const toggleLeftColActiveElement = useMediaStore(
    (state) => state.toggleLeftColActiveElement
  );
  const activeMediaElement = useMediaStore((state) => state.activeMediaElement);

  const toggleLeftColActiveElementAnimate = useCallback(() => {
    toggleLeftColActiveElement();
    console.log(activeMediaElement);
  }, []);

  const dispatchObject = useCallback((event: string) => {
    const dispatcherObjects = {
      toggleLeftColActiveElement: { action: toggleLeftColActiveElementAnimate },
    };

    return dispatcherObjects[event as keyof typeof dispatcherObjects];
  }, []);

  useEffect(() => {
    if (props.eventState) {
      const eventObject =
        media_scene_directions[
          props.eventState as keyof typeof media_scene_directions
        ];

      const eventAction = eventObject.action;
      const dispatchedObject = dispatchObject(eventAction);
      if (dispatchedObject) {
        dispatchedObject.action();
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default MediaSceneStateManager;
