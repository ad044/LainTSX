import React, { useCallback, useEffect } from "react";

import { StateManagerProps } from "../EventManager";

const MediaComponentManager = (props: StateManagerProps) => {
  const playMedia = useCallback(() => {
    const mediaElement = document.getElementById("media") as HTMLMediaElement;
    // if (mediaElement) mediaElement.play().then((r) => console.log(r));
  }, []);

  const dispatchObject = useCallback(
    (event: string) => {
      const dispatcherObjects = {
        play_select: { action: playMedia },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [playMedia]
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedObject = dispatchObject(props.eventState);

      if (dispatchedObject) {
        dispatchedObject.action();
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default MediaComponentManager;
