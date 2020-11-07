import { useCallback, useEffect } from "react";

import { StateManagerProps } from "./EventManager";
import site_a from "../../resources/site_a.json";
import image_table from "../../resources/image_table.json";
import { ImageSrc, useImageStore } from "../../store";

const MediaImageManager = (props: StateManagerProps) => {
  const setImages = useImageStore((state) => state.setImages);

  const updateSceneImages = useCallback(
    (newActiveBlueOrbId: string) => {
      const node_name =
        site_a[newActiveBlueOrbId as keyof typeof site_a].node_name;
      const images = image_table[node_name as keyof typeof image_table];

      Object.values(images).forEach((img) => {
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
    },
    [setImages]
  );

  const dispatchObject = useCallback(
    (event: string, newActiveBlueOrbId: string) => {
      const dispatcherObjects = {
        throw_blue_orb_media: {
          action: updateSceneImages,
          value: newActiveBlueOrbId,
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [updateSceneImages]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newActiveBlueOrbId = props.eventState.newActiveBlueOrbId;
      const dispatchedObject = dispatchObject(eventAction, newActiveBlueOrbId);

      if (dispatchedObject) {
        dispatchedObject.action(dispatchedObject.value);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default MediaImageManager;
