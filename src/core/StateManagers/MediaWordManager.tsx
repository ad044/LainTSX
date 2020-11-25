import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useMediaWordStore } from "../../store";

const MediaWordManager = (props: StateManagerProps) => {
  const setPosStateIdx = useMediaWordStore((state) => state.setPosStateIdx);
  const resetPosStateIdx = useMediaWordStore((state) => state.resetPosStateIdx);

  const dispatchObject = useCallback(
    (event: string, newWordPosStateIdx: number) => {
      switch (event) {
        case "fstWord_down":
        case "sndWord_down":
        case "thirdWord_down":
        case "fstWord_up":
        case "sndWord_up":
        case "thirdWord_up":
          return {
            action: setPosStateIdx,
            value: newWordPosStateIdx,
          };
        case "throw_node_media":
          return {
            action: resetPosStateIdx,
          };
      }
    },
    [resetPosStateIdx, setPosStateIdx]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newWordPosStateIdx = props.eventState.newWordPosStateIdx;

      const dispatchedObject = dispatchObject(eventAction, newWordPosStateIdx);

      if (dispatchedObject) {
        dispatchedObject.action(dispatchedObject.value as any);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default MediaWordManager;
