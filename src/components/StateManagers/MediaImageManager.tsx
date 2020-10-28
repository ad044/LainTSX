import { useCallback, useEffect } from "react";

import { StateManagerProps } from "./EventManager";
import game_action_mappings from "../../resources/game_action_mappings.json";
import site_a from "../../resources/site_a.json";
import image_table from "../../resources/image_table.json";
import { ImageSrc, useImageStore } from "../../store";

const MediaImageManager = (props: StateManagerProps) => {
  const setImages = useImageStore((state) => state.setImages);

  const updateSceneImages = useCallback((targetBlueOrbId: string) => {
    const node_name = site_a[targetBlueOrbId as keyof typeof site_a].node_name;
    const images = image_table[node_name as keyof typeof image_table];

    Object.values(images).forEach((img) => {
      console.log(images);
      switch (img.substr(img.length - 1)) {
        case "0":
          import("../../static/media_images/site_a/" + img + ".png").then(
            (imageSrc: ImageSrc) => {
              setImages(imageSrc, 1);
            }
          );
          break;
        case "1":
          import("../../static/media_images/site_a/" + img + ".png").then(
            (imageSrc: ImageSrc) => {
              setImages(imageSrc, 2);
            }
          );
          break;
        case "2":
          import("../../static/media_images/site_a/" + img + ".png").then(
            (imageSrc: ImageSrc) => {
              setImages(imageSrc, 3);
            }
          );
          break;
        default:
          break;
      }
    });
  }, []);

  const dispatchObject = useCallback(
    (event: string, targetBlueOrbId: string) => {
      const dispatcherObjects = {
        select_blue_orb: { action: updateSceneImages, value: targetBlueOrbId },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [updateSceneImages]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventObject: any =
        game_action_mappings[
          props.eventState as keyof typeof game_action_mappings
        ];

      if (eventObject) {
        const eventAction = eventObject.action;
        const targetBlueOrbId = eventObject.target_blue_orb_id;

        const dispatchedObject = dispatchObject(eventAction, targetBlueOrbId);

        if (dispatchedObject) {
          dispatchedObject.action(dispatchedObject.value);
        }
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default MediaImageManager;
