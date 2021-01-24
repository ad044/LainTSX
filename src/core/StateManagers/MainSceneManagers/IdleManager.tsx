import React, { useCallback, useEffect } from "react";
import { StateManagerProps } from "../EventManager";
import { SiteType } from "../../../components/MainScene/SyncedComponents/Site";
import site_a from "../../../resources/site_a.json";
import site_b from "../../../resources/site_b.json";
import { useStore } from "../../../store";

const IdleManager = (props: StateManagerProps) => {
  const setImages = useStore((state) => state.setIdleImages);
  const setMedia = useStore((state) => state.setIdleMedia);

  const playIdleMedia = useCallback(
    (site: string) => {
      const siteAIdleNodes = {
        audio: [
          "0000",
          "0001",
          "0002",
          "0003",
          "0004",
          "0005",
          "0006",
          "0007",
          "0008",
          "0009",
        ],
        video: [
          "INS01.STR",
          "INS02.STR",
          "INS03.STR",
          "INS04.STR",
          "INS05.STR",
          "INS06.STR",
          "INS07.STR",
          "INS08.STR",
          "INS09.STR",
          "INS10.STR",
          "INS11.STR",
          "INS12.STR",
          "INS13.STR",
          "INS14.STR",
          "INS15.STR",
          "INS16.STR",
          "INS17.STR",
          "INS18.STR",
          "INS19.STR",
          "INS20.STR",
          "INS21.STR",
          "INS22.STR",
        ],
      };

      const siteBIdleNodes = {
        audio: ["1015", "1219", "0419", "0500", "0501", "0508", "0510", "0513"],
        video: [
          "INS16.STR",
          "INS17.STR",
          "INS18.STR",
          "INS19.STR",
          "INS20.STR",
          "INS21.STR",
          "INS22.STR",
        ],
      };

      const siteData = site === "a" ? site_a : site_b;
      const idleNodes = site === "a" ? siteAIdleNodes : siteBIdleNodes;

      if (Math.random() < 0.5) {
        const nodeToPlay =
          idleNodes.audio[Math.floor(Math.random() * idleNodes.audio.length)];

        const level = nodeToPlay.substr(0, 2);

        const images = (siteData as SiteType)[level][nodeToPlay]
          .image_table_indices;
        const media = (siteData as SiteType)[level][nodeToPlay].media_file;

        setMedia(media);
        setImages(images);
      } else {
        setMedia(
          idleNodes.video[Math.floor(Math.random() * idleNodes.video.length)]
        );
      }
    },
    [setImages, setMedia]
  );

  const dispatchObject = useCallback(
    (eventState: { event: string; site: string }) => {
      switch (eventState.event) {
        case "play_idle_media":
          return {
            action: playIdleMedia,
            value: eventState.site,
          };
      }
    },
    [playIdleMedia]
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedObject = dispatchObject(props.eventState);

      if (dispatchedObject) {
        dispatchedObject.action(dispatchedObject.value);
      }
    }
  }, [dispatchObject, props.eventState]);
  return null;
};

export default IdleManager;
