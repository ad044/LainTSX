import { useCallback, useEffect } from "react";
import { useStore } from "../../../store";
import { StateManagerProps } from "../EventManager";

const SiteManager = (props: StateManagerProps) => {
  const setPos = useStore((state) => state.setSitePos);
  const setRot = useStore((state) => state.setSiteRot);
  const setRotX = useStore((state) => state.setSiteRotX);

  const dispatchObject = useCallback(
    (eventState: { event: string; sitePosY: number; siteRotY: number }) => {
      switch (eventState.event) {
        case "site_up":
        case "site_down":
        case "select_level_up":
        case "select_level_down":
          return {
            action: setPos,
            value: [[0, eventState.sitePosY, 0]],
            actionDelay: 1300,
          };
        case "site_left":
        case "site_right":
          return {
            action: setRot,
            value: [[0, eventState.siteRotY, 0]],
            actionDelay: 1100,
          };
        case "pause_game":
          return {
            action: setRotX,
            value: [Math.PI / 2],
            actionDelay: 3600,
          };
        case "pause_exit_select":
          return {
            action: setRotX,
            value: [0],
            actionDelay: 0,
          };
      }
    },
    [setPos, setRot, setRotX]
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedObject = dispatchObject(props.eventState);

      if (dispatchedObject) {
        setTimeout(() => {
          (dispatchedObject.action as any).apply(
            null,
            dispatchedObject.value as any
          );
        }, dispatchedObject.actionDelay);
      }
    }
  }, [dispatchObject, props.eventState]);
  return null;
};

export default SiteManager;
