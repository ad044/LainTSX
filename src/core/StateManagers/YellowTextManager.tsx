import { useCallback, useEffect } from "react";
import node_huds from "../../resources/node_huds.json";
import site_a from "../../resources/site_a.json";
import site_b from "../../resources/site_b.json";
import { useBigTextStore, useSiteStore } from "../../store";
import { SiteType } from "../../components/MainScene/Site";
import { StateManagerProps } from "./EventManager";

const YellowTextManager = (props: StateManagerProps) => {
  const setTransformState = useBigTextStore((state) => state.setTransformState);
  const addToTransformState = useBigTextStore(
    (state) => state.addToTransformState
  );
  const setText = useBigTextStore((state) => state.setText);

  const setDisableTrail = useBigTextStore((state) => state.setDisableTrail);

  const setColor = useBigTextStore((state) => state.setColor);

  const setVisible = useBigTextStore((state) => state.setVisible);

  const currentSite = useSiteStore((state) => state.currentSite);
  const siteData = currentSite === "a" ? site_a : site_b;

  const animateYellowTextWithMove = useCallback(
    (
      posXOffset: number,
      posYOffset: number,
      newActiveHudId: string,
      newActiveNodeId: string,
      newLevel: string,
      delay: number
    ) => {
      setDisableTrail(true);

      // animate the letters to match that of site's
      // to create an illusion of not moving
      setTimeout(() => {
        addToTransformState(posXOffset, "posX");
        addToTransformState(posYOffset, "posY");
      }, delay);

      setTimeout(() => {
        // make current hud big text shrink
        setTransformState(-1, "xOffset");
      }, 2500);

      setTimeout(() => {
        // animate it to new pos x/y
        setTransformState(
          node_huds[newActiveHudId as keyof typeof node_huds].big_text[0],
          "posX"
        );
        setTransformState(
          node_huds[newActiveHudId as keyof typeof node_huds].big_text[1],
          "posY"
        );
        // set new text according to the node name
        const targetText =
          newActiveNodeId === "UNKNOWN"
            ? "Unknown"
            : (siteData as SiteType)[newLevel][newActiveNodeId].node_name;

        setText(targetText);
        setDisableTrail(false);
      }, 3000);

      // unshrink text
      setTimeout(() => {
        setTransformState(0, "xOffset");
      }, 3900);
    },
    [addToTransformState, setDisableTrail, setText, setTransformState, siteData]
  );

  const animateYellowTextWithoutMove = useCallback(
    (newActiveHudId: string, newActiveNodeId: string, level: string) => {
      // make current hud big text shrink
      setTransformState(-1, "xOffset");

      setTimeout(() => {
        // animate it to new pos x/y
        setTransformState(
          node_huds[newActiveHudId as keyof typeof node_huds].big_text[0],
          "posX"
        );
        setTransformState(
          node_huds[newActiveHudId as keyof typeof node_huds].big_text[1],
          "posY"
        );
      }, 400);

      setTimeout(() => {
        // set new text according to the node name
        setText((siteData as SiteType)[level][newActiveNodeId].node_name);
      }, 1000);

      setTimeout(() => {
        // unshrink text
        setTransformState(0, "xOffset");
      }, 1200);
    },
    [setText, setTransformState, siteData]
  );

  const initializeLevelSelection = useCallback(() => {
    setTransformState(-1, "xOffset");

    setTimeout(() => {
      setTransformState(-0.02, "posX");
      setTransformState(0.005, "posY");
    }, 400);

    setTimeout(() => {
      setText("Jump To");
      setColor("orange");
    }, 1000);

    setTimeout(() => {
      setTransformState(0, "xOffset");
    }, 1200);
  }, [setColor, setText, setTransformState]);

  const levelSelectionBack = useCallback(
    (activeNodeId: string, activeHudId: string, level: string) => {
      setTransformState(-1, "xOffset");

      setTimeout(() => {
        setTransformState(
          node_huds[activeHudId as keyof typeof node_huds].big_text[0],
          "posX"
        );
        setTransformState(
          node_huds[activeHudId as keyof typeof node_huds].big_text[1],
          "posY"
        );
      }, 400);

      setTimeout(() => {
        setColor("yellow");
        setText((siteData as SiteType)[level][activeNodeId].node_name);
      }, 1000);

      setTimeout(() => {
        setTransformState(0, "xOffset");
      }, 1200);
    },
    [setColor, setText, setTransformState, siteData]
  );

  const toggleVisibleAfterLevelSelect = useCallback(
    (activeNodeId: string, activeHudId: string, level: string) => {
      setVisible(false);

      setTimeout(() => {
        setTransformState(
          node_huds[activeHudId as keyof typeof node_huds].big_text[0],
          "posX"
        );
        setTransformState(
          node_huds[activeHudId as keyof typeof node_huds].big_text[1],
          "posY"
        );
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
    [setColor, setText, setTransformState, setVisible, siteData]
  );

  const dispatchObject = useCallback(
    (
      event: string,
      newActiveHudId: string | undefined,
      newActiveNodeId: string | undefined,
      newLevel: string
    ) => {
      switch (event) {
        case "site_up":
          return {
            action: animateYellowTextWithMove,
            value: [0, -1.5, newActiveHudId, newActiveNodeId, newLevel, 1300],
          };
        case "site_down":
          return {
            action: animateYellowTextWithMove,
            value: [0, 1.5, newActiveHudId, newActiveNodeId, newLevel, 1300],
          };
        case "site_left":
          return {
            action: animateYellowTextWithMove,
            value: [
              Math.PI / 4,
              0,
              newActiveHudId,
              newActiveNodeId,
              newLevel,
              1100,
            ],
          };
        case "site_right":
          return {
            action: animateYellowTextWithMove,
            value: [
              -Math.PI / 4,
              0,
              newActiveHudId,
              newActiveNodeId,
              newLevel,
              1100,
            ],
          };
        case "change_node":
          return {
            action: animateYellowTextWithoutMove,
            value: [newActiveHudId, newActiveNodeId, newLevel],
          };
        case "level_selection_back":
          return {
            action: levelSelectionBack,
            value: [newActiveNodeId, newActiveHudId, newLevel],
          };
        case "toggle_level_selection":
          return {
            action: initializeLevelSelection,
          };
        case "select_level_up":
        case "select_level_down":
          return {
            action: toggleVisibleAfterLevelSelect,
            value: [newActiveNodeId, newActiveHudId, newLevel],
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
      const eventAction = props.eventState.event;

      const newActiveNodeId = props.eventState.newActiveNodeId;
      const newActiveHudId = props.eventState.newActiveHudId;
      const newLevel = props.eventState.newLevel;

      const dispatchedObject = dispatchObject(
        eventAction,
        newActiveHudId,
        newActiveNodeId,
        newLevel
      );

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

export default YellowTextManager;
