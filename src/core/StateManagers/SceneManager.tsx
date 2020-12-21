import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useSceneStore } from "../../store";

const SceneManager = (props: StateManagerProps) => {
  const setScene = useSceneStore((state) => state.setScene);

  const dispatchObject = useCallback(
    (event: string, newScene: string) => {
      switch (event) {
        case "throw_node_media":
        case "throw_node_gate":
        case "throw_node_sskn":
        case "throw_node_tak":
          return {
            action: setScene,
            value: newScene,
            delay: 3450,
          };
        case "media_exit_select":
        case "exit_gate":
        case "sskn_cancel_select":
          return {
            action: setScene,
            value: "main",
            delay: 0,
          };
        case "sskn_ok_select":
          return {
            action: setScene,
            value: "main",
            delay: 6000,
          };
      }
    },
    [setScene]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newScene = props.eventState.newScene;

      const dispatchedObject = dispatchObject(eventAction, newScene);

      if (dispatchedObject) {
        setTimeout(() => {
          dispatchedObject.action(dispatchedObject.value);
        }, dispatchedObject.delay);
      }
    }
  }, [props.eventState, dispatchObject]);

  return null;
};

export default SceneManager;
