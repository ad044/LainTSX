import { useCallback, useEffect } from "react";
import node_huds from "../../../resources/node_huds.json";
import site_a from "../../../resources/site_a.json";
import site_b from "../../../resources/site_b.json";
import { useMainSceneStore } from "../../../store";
import { SiteType } from "../../../components/MainScene/SyncedComponents/Site";
import { StateManagerProps } from "../EventManager";

const BigTextManager = (props: StateManagerProps) => {
  const setText = useMainSceneStore((state) => state.setBigText);
  const setColor = useMainSceneStore((state) => state.setBigTextColor);
  const setVisible = useMainSceneStore((state) => state.setBigTextVisible);
  const setXOffset = useMainSceneStore((state) => state.setBigTextXOffset);
  const setPos = useMainSceneStore((state) => state.setBigTextPos);

  const siteData = useMainSceneStore(
    useCallback((state) => (state.activeSite === "a" ? site_a : site_b), [])
  );

  const animateYellowTextWithMove = useCallback(
    (
      posXOffset: number,
      posYOffset: number,
      newActiveHudId: string,
      newActiveNodeId: string,
      newLevel: string,
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
        setPos(node_huds[newActiveHudId as keyof typeof node_huds].big_text);
        // set new text according to the node name
        const targetText =
          newActiveNodeId === "UNKNOWN"
            ? "Unknown"
            : (siteData as SiteType)[newLevel][newActiveNodeId].node_name;

        setText(targetText);
      }, 3000);

      // unshrink text
      setTimeout(() => {
        setXOffset(0);
      }, 3900);
    },
    [setPos, setText, setXOffset, siteData]
  );

  const animateYellowTextWithoutMove = useCallback(
    (newActiveHudId: string, newActiveNodeId: string, level: string) => {
      // make current hud big text shrink
      setXOffset(-1);

      setTimeout(() => {
        // animate it to new pos x/y
        setPos(node_huds[newActiveHudId as keyof typeof node_huds].big_text);
      }, 400);

      setTimeout(() => {
        // set new text according to the node name
        setText((siteData as SiteType)[level][newActiveNodeId].node_name);
      }, 1000);

      setTimeout(() => {
        // unshrink text
        setXOffset(0);
      }, 1200);
    },
    [setPos, setText, setXOffset, siteData]
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
    (activeNodeId: string, activeHudId: string, level: string) => {
      setXOffset(-1);

      setTimeout(() => {
        setPos(node_huds[activeHudId as keyof typeof node_huds].big_text);
      }, 400);

      setTimeout(() => {
        setColor("yellow");
        setText((siteData as SiteType)[level][activeNodeId].node_name);
      }, 1000);

      setTimeout(() => {
        setXOffset(0);
      }, 1200);
    },
    [setColor, setPos, setText, setXOffset, siteData]
  );

  const toggleVisibleAfterLevelSelect = useCallback(
    (activeNodeId: string, activeHudId: string, level: string) => {
      setVisible(false);

      setTimeout(() => {
        setPos(node_huds[activeHudId as keyof typeof node_huds].big_text[0]);
        setColor("yellow");
        const targetText =
          activeNodeId === "UNKNOWN"
            ? "Unknown"
            : (siteData as SiteType)[level][activeNodeId].node_name;

        setText(targetText);
      }, 400);

      setTimeout(() => {
        setVisible(true);
      }, 3900);
    },
    [setColor, setPos, setText, setVisible, siteData]
  );

  const dispatchObject = useCallback(
    (eventState: {
      event: string;
      activeHudId: string;
      activeNodeId: string;
      level: string;
    }) => {
      switch (eventState.event) {
        case "site_up":
          return {
            action: animateYellowTextWithMove,
            value: [
              0,
              -1.5,
              eventState.activeHudId,
              eventState.activeNodeId,
              eventState.level,
              1300,
            ],
          };
        case "site_down":
          return {
            action: animateYellowTextWithMove,
            value: [
              0,
              1.5,
              eventState.activeHudId,
              eventState.activeNodeId,
              eventState.level,
              1300,
            ],
          };
        case "site_left":
          return {
            action: animateYellowTextWithMove,
            value: [
              Math.PI / 4,
              0,
              eventState.activeHudId,
              eventState.activeNodeId,
              eventState.level,
              1100,
            ],
          };
        case "site_right":
          return {
            action: animateYellowTextWithMove,
            value: [
              -Math.PI / 4,
              0,
              eventState.activeHudId,
              eventState.activeNodeId,
              eventState.level,
              1100,
            ],
          };
        case "change_node":
          return {
            action: animateYellowTextWithoutMove,
            value: [
              eventState.activeHudId,
              eventState.activeNodeId,
              eventState.level,
            ],
          };
        case "level_selection_back":
          return {
            action: levelSelectionBack,
            value: [
              eventState.activeNodeId,
              eventState.activeHudId,
              eventState.level,
            ],
          };
        case "toggle_level_selection":
          return {
            action: initializeLevelSelection,
          };
        case "select_level_up":
        case "select_level_down":
          return {
            action: toggleVisibleAfterLevelSelect,
            value: [
              eventState.activeNodeId,
              eventState.activeHudId,
              eventState.level,
            ],
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
