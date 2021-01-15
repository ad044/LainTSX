import { useCallback, useEffect } from "react";
import { useMediaBigTextStore } from "../../../store";
import { StateManagerProps } from "../EventManager";

const MediaYellowTextManager = (props: StateManagerProps) => {
  const setTransformState = useMediaBigTextStore(
    (state) => state.setTransformState
  );

  const setText = useMediaBigTextStore((state) => state.setText);

  const animateMediaYellowText = useCallback(
    (
      targetMediaComponentText: string,
      targetMediaComponentTextPos: number[]
    ) => {
      // make current text shrink
      setTransformState(-1, "xOffset");

      setTimeout(() => {
        setTransformState(targetMediaComponentTextPos[0], "posX");
        setTransformState(targetMediaComponentTextPos[1], "posY");
      }, 400);

      setTimeout(() => {
        setText(targetMediaComponentText);
      }, 1000);

      setTimeout(() => {
        // unshrink text
        setTransformState(0, "xOffset");
      }, 1200);
    },
    [setText, setTransformState]
  );

  const dispatchObject = useCallback(
    (eventState: { event: string }) => {
      switch (eventState.event) {
        case "media_leftside_up":
        case "throw_node_media":
          return {
            action: animateMediaYellowText,
            value: ["Play", [-0.8, 0.05, 0.6]],
          };
        case "media_leftside_down":
          return {
            action: animateMediaYellowText,
            value: ["Exit", [-0.8, -0.08, 0.6]],
          };
      }
    },
    [animateMediaYellowText]
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedObject = dispatchObject(props.eventState);

      if (dispatchedObject) {
        (dispatchedObject.action as any).apply(null, dispatchedObject.value);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default MediaYellowTextManager;
