import { useCallback, useEffect, useMemo } from "react";

import { StateManagerProps } from "./EventManager";
import site_a from "../../resources/site_a.json";
import image_table from "../../resources/image_table.json";
import { ImageSrc, useImageStore, useLevelStore } from "../../store";
import { LevelType } from "../../components/MainScene/Site";

const MediaImageManager = (props: StateManagerProps) => {
  const setImages = useImageStore((state) => state.setImages);

  const currentLevel = useLevelStore((state) => state.currentLevel);
  const currentLevelData: LevelType = useMemo(
    () => site_a[currentLevel as keyof typeof site_a],
    [currentLevel]
  );

  const updateSceneImages = useCallback(
    (newActiveNodeId: string) => {
      const nodeName = currentLevelData[newActiveNodeId].node_name;
      const images = image_table[nodeName as keyof typeof image_table];

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
    [currentLevelData, setImages]
  );

  const dispatchObject = useCallback(
    (event: string, newActiveNodeId: string) => {
      const dispatcherObjects = {
        throw_node_media: {
          action: updateSceneImages,
          value: newActiveNodeId,
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [updateSceneImages]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newActiveNodeId = props.eventState.newActiveNodeId;
      const dispatchedObject = dispatchObject(eventAction, newActiveNodeId);

      if (dispatchedObject) {
        dispatchedObject.action(dispatchedObject.value);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default MediaImageManager;
