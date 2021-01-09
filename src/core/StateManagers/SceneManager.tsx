import { useCallback, useEffect } from "react";
import { StateManagerProps } from "./EventManager";
import { useMainSceneStore, useSceneStore } from "../../store";

const SceneManager = (props: StateManagerProps) => {
  const setScene = useSceneStore((state) => state.setScene);
  const setMainSceneIntro = useMainSceneStore((state) => state.setIntro);

  const dispatchObject = useCallback(
    (eventState: { event: string; scene: string }) => {
      switch (eventState.event) {
        case "throw_node_media":
        case "throw_node_gate":
        case "throw_node_sskn":
        case "throw_node_tak":
          return {
            action: setScene,
            value: eventState.scene,
            delay: 3450,
            setMainSceneIntro: false,
          };
        case "rip_node_media":
        case "rip_node_gate":
        case "rip_node_sskn":
        case "rip_node_tak":
          return {
            action: setScene,
            value: eventState.scene,
            delay: 6000,
            setMainSceneIntro: false,
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
        case "pause_change_select":
          return {
            action: setScene,
            value: "change_disc",
            delay: 0,
            setMainSceneIntro: true,
          };
      }
    },
    [setScene]
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedObject = dispatchObject(props.eventState);

      if (dispatchedObject) {
        setTimeout(() => {
          dispatchedObject.action(dispatchedObject.value);
        }, dispatchedObject.delay);
        if (dispatchedObject.setMainSceneIntro !== undefined) {
          if (dispatchedObject.setMainSceneIntro) {
            setMainSceneIntro(true);
          } else {
            setMainSceneIntro(false);
          }
        }
      }
    }
  }, [props.eventState, dispatchObject, setMainSceneIntro]);

  return null;
};

export default SceneManager;
