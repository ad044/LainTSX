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
          return {
            action: setScene,
            value: newScene,
            delay: 3904.704,
          };
        case "exit_select":
        case "exit_gate":
          return {
            action: setScene,
            value: "main",
            delay: 0,
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
