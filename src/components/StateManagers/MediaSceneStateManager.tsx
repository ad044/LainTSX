import React, { useCallback, useEffect } from "react";
import { useMediaStore } from "../../store";
import media_scene_directions from "../../resources/media_scene_directions.json";
import { StateManagerProps } from "./EventStateManager";

const MediaSceneStateManager = (props: StateManagerProps) => {
  const setActiveMediaElement = useMediaStore(
    (state) => state.setActiveMediaElement
  );
  const setActiveMediaElementText = useMediaStore(
    (state) => state.setLeftColActiveMediaElementText
  );
  const setActiveMediaElementTextPos = useMediaStore(
    (state) => state.setLeftColActiveMediaElementTextPos
  );

  const updateActiveMediaElementAnimate = useCallback(
    (
      targetMediaElement: string,
      targetMediaElementText,
      targetMediaElementTextPos
    ) => {
      setActiveMediaElement(targetMediaElement);
      setActiveMediaElementText(targetMediaElementText);
      setActiveMediaElementTextPos(targetMediaElementTextPos);
    },
    []
  );

  const dispatchObject = useCallback(
    (
      event: string,
      targetMediaElement: string,
      targetMediaElementText,
      targetMediaElementTextPos
    ) => {
      const dispatcherObjects = {
        setActiveMediaElement: {
          action: updateActiveMediaElementAnimate,
          value: [
            targetMediaElement,
            targetMediaElementText,
            targetMediaElementTextPos,
          ],
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
        const targetMediaElementText = eventObject.target_media_element_text;
        const targetMediaElementTextPos =
          eventObject.target_media_element_text_position;

        const dispatchedObject = dispatchObject(
          eventAction,
          targetMediaElement,
          targetMediaElementText,
          targetMediaElementTextPos
        );
        if (dispatchedObject) {
          (dispatchedObject.action as any).apply(null, dispatchedObject.value);
        }
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default MediaSceneStateManager;
