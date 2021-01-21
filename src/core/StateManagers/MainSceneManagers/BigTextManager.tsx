import { useCallback, useEffect } from "react";
import site_a from "../../../resources/site_a.json";
import site_b from "../../../resources/site_b.json";
import { useMainSceneStore } from "../../../store";
import { NodeDataType } from "../../../components/MainScene/SyncedComponents/Site";
import { StateManagerProps } from "../EventManager";
import { HUDType } from "../../../components/MainScene/SyncedComponents/HUD";

const BigTextManager = (props: StateManagerProps) => {
  const setText = useMainSceneStore((state) => state.setBigText);
  const setColor = useMainSceneStore((state) => state.setBigTextColor);
  const setVisible = useMainSceneStore((state) => state.setBigTextVisible);
  const setXOffset = useMainSceneStore((state) => state.setBigTextXOffset);
  const setPos = useMainSceneStore((state) => state.setBigTextPos);

  const animateYellowTextWithMove = useCallback(
    (
      posXOffset: number,
      posYOffset: number,
      hud: HUDType,
      node: NodeDataType | "UNKNOWN",
      delay: number
    ) => {
      // animate the letters to match that of site's
      // to create an illusion of not moving
      // setTimeout(() => {
      //   addToTransformState(posXOffset, "posX");
      //   addToTransformState(posYOffset, "posY");
      // }, delay);

      setTimeout(() => {
        // make current hud big text shrink
        setXOffset(-1, "xOffset");
      }, 2500);

      setTimeout(() => {
        // animate it to new pos x/y
        setPos(hud.big_text);
        // set new text according to the node name
        const targetText = node === "UNKNOWN" ? "Unknown" : node.node_name;

        setText(targetText);
      }, 3000);

      // unshrink text
      setTimeout(() => {
        setXOffset(0);
      }, 3900);
    },
    [setPos, setText, setXOffset]
  );

  const animateYellowTextWithoutMove = useCallback(
    (hud: HUDType, node: NodeDataType) => {
      // make current hud big text shrink
      setXOffset(-1);

      setTimeout(() => {
        // animate it to new pos x/y
        setPos(hud.big_text);
      }, 400);

      setTimeout(() => {
        // set new text according to the node name
        setText(node.node_name);
      }, 1000);

      setTimeout(() => {
        // unshrink text
        setXOffset(0);
      }, 1200);
    },
    [setPos, setText, setXOffset]
  );

  const initializeLevelSelection = useCallback(() => {
    setXOffset(-1);

    setTimeout(() => {
      setPos([-0.02, 0.005, -8.7]);
    }, 400);

    setTimeout(() => {
      setText("Jump To");
      setColor("orange");
    }, 1000);

    setTimeout(() => {
      setXOffset(0);
    }, 1200);
  }, [setColor, setPos, setText, setXOffset]);

  const levelSelectionBack = useCallback(
    (node: NodeDataType, hud: HUDType) => {
      setXOffset(-1);

      setTimeout(() => {
        setPos(hud.big_text);
      }, 400);

      setTimeout(() => {
        setColor("yellow");
        setText(node.node_name);
      }, 1000);

      setTimeout(() => {
        setXOffset(0);
      }, 1200);
    },
    [setColor, setPos, setText, setXOffset]
  );

  const toggleVisibleAfterLevelSelect = useCallback(
    (node: NodeDataType | "UNKNOWN", hud: HUDType) => {
      setVisible(false);

      setTimeout(() => {
        setPos(hud.big_text[0]);
        setColor("yellow");
        const targetText = node === "UNKNOWN" ? "Unknown" : node.node_name;

        setText(targetText);
      }, 400);

      setTimeout(() => {
        setVisible(true);
      }, 3900);
    },
    [setColor, setPos, setText, setVisible]
  );

  const dispatchObject = useCallback(
    (eventState: {
      event: string;
      hud: HUDType;
      node: NodeDataType;
      level: string;
    }) => {
      switch (eventState.event) {
        case "site_up":
          return {
            action: animateYellowTextWithMove,
            value: [0, -1.5, eventState.hud, eventState.node, 1300],
          };
        case "site_down":
          return {
            action: animateYellowTextWithMove,
            value: [0, 1.5, eventState.hud, eventState.node, 1300],
          };
        case "site_left":
          return {
            action: animateYellowTextWithMove,
            value: [Math.PI / 4, 0, eventState.hud, eventState.node, 1100],
          };
        case "site_right":
          return {
            action: animateYellowTextWithMove,
            value: [-Math.PI / 4, 0, eventState.hud, eventState.node, 1100],
          };
        case "change_node":
          return {
            action: animateYellowTextWithoutMove,
            value: [eventState.hud, eventState.node],
          };
        case "level_selection_back":
          return {
            action: levelSelectionBack,
            value: [eventState.node, eventState.hud],
          };
        case "toggle_level_selection":
          return {
            action: initializeLevelSelection,
          };
        case "select_level_up":
        case "select_level_down":
          return {
            action: toggleVisibleAfterLevelSelect,
            value: [eventState.node, eventState.hud],
          };
      }
    },
    [
      animateYellowTextWithMove,
      animateYellowTextWithoutMove,
      initializeLevelSelection,
      levelSelectionBack,
      toggleVisibleAfterLevelSelect,
    ]
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedObject = dispatchObject(props.eventState);

      if (dispatchedObject) {
        (dispatchedObject.action as any).apply(null, dispatchedObject.value);
      }
    }
  }, [
    animateYellowTextWithMove,
    animateYellowTextWithoutMove,
    props.eventState,
    dispatchObject,
  ]);

  return null;
};

export default BigTextManager;
