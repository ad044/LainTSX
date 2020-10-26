import React, { useCallback, useEffect } from "react";
import image_table from "../../../resources/image_table.json";
import site_a from "../../../resources/site_a.json";
import { StateManagerProps } from "../EventManager";
import blue_orb_directions from "../../../resources/blue_orb_directions.json";
import sex from "../../../static/media_images/site_a/[9]Lda024-0.png";
import { useImageStore } from "../../../store";

const ImageManager = (props: StateManagerProps) => {
  const setImg = useImageStore((state) => state.img);
  const setImages = useCallback(
    (targetBlueOrbId: string) => {
      //const node_name = site_a[targetBlueOrbId as keyof typeof site_a].node_name;
      const images = image_table["Lda024" as keyof typeof image_table];

      const p = require("../../../static/media_images/site_a/[9]Lda024-0.png");
      import(p).then((image) => {
        setImg(image);
      });
      console.log(sex)
    },
    [setImg]
  );
  const dispatchObject = useCallback(
    (event: string, targetBlueOrbId: string) => {
      const dispatcherObjects = {
        play_select: { action: setImages, value: targetBlueOrbId },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [setImages]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventObject =
        blue_orb_directions[
          props.eventState as keyof typeof blue_orb_directions
        ];

      console.log(eventObject);
      const targetBlueOrbId = "";

      const dispatchedObject = dispatchObject(
        props.eventState,
        targetBlueOrbId
      );

      if (dispatchedObject) {
        dispatchedObject.action(dispatchedObject.value);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default ImageManager;
