import { useCallback, useEffect } from "react";
import node_huds from "../../resources/node_huds.json";
import site_a from "../../resources/site_a.json";
import { useTextRendererStore } from "../../store";
import { SiteType } from "../../components/MainScene/Site";

const YellowTextManager = (props: any) => {
  const setYellowText = useTextRendererStore((state) => state.setYellowText);

  const setYellowTextOffsetXCoeff = useTextRendererStore(
    (state) => state.setYellowTextOffsetXCoeff
  );

  const addToYellowTextPosY = useTextRendererStore(
    (state) => state.addToYellowTextPosY
  );
  const addToYellowTextPosX = useTextRendererStore(
    (state) => state.addToYellowTextPosX
  );
  const setYellowTextPosY = useTextRendererStore(
    (state) => state.setYellowTextPosY
  );
  const setYellowTextPosX = useTextRendererStore(
    (state) => state.setYellowTextPosX
  );

  const animateYellowTextWithMove = useCallback(
    (
      yellowLetterPosXOffset: number,
      yellowLetterPosYOffset: number,
      newActiveHudId: string,
      newActiveNodeId: string,
      newLevel: string,
      delay: number
    ) => {
      // animate the letters to match that of site's
      // to create an illusion of not moving
      setTimeout(() => {
        addToYellowTextPosY(yellowLetterPosYOffset);
        addToYellowTextPosX(yellowLetterPosXOffset);
      }, delay);

      setTimeout(() => {
        // make current hud big text shrink
        setYellowTextOffsetXCoeff(-1);
      }, 2500);

      setTimeout(() => {
        // animate it to new pos x/y
        setYellowTextPosX(
          node_huds[newActiveHudId as keyof typeof node_huds].big_text[0]
        );
        setYellowTextPosY(
          node_huds[newActiveHudId as keyof typeof node_huds].big_text[1]
        );
        // set new text according to the node name
        setYellowText(
          (site_a as SiteType)[newLevel][newActiveNodeId].node_name
        );
      }, 3000);

      // unshrink text
      setTimeout(() => {
        setYellowTextOffsetXCoeff(0);
      }, 3900);
    },
    [
      addToYellowTextPosX,
      addToYellowTextPosY,
      setYellowText,
      setYellowTextOffsetXCoeff,
      setYellowTextPosX,
      setYellowTextPosY,
    ]
  );

  const animateYellowTextWithoutMove = useCallback(
    (newActiveHudId: string, newActiveNodeId: string, level: string) => {
      // make current hud big text shrink
      setYellowTextOffsetXCoeff(-1);

      setTimeout(() => {
        setYellowTextPosX(
          node_huds[newActiveHudId as keyof typeof node_huds].big_text[0]
        );
        setYellowTextPosY(
          node_huds[newActiveHudId as keyof typeof node_huds].big_text[1]
        );
      }, 400);
      // animate it to new pos x/y

      setTimeout(() => {
        // set new text according to the node name
        setYellowText((site_a as SiteType)[level][newActiveNodeId].node_name);
      }, 1000);

      setTimeout(() => {
        // unshrink text
        setYellowTextOffsetXCoeff(0);
      }, 1200);
    },
    [
      setYellowText,
      setYellowTextOffsetXCoeff,
      setYellowTextPosX,
      setYellowTextPosY,
    ]
  );

  const animateMediaYellowText = useCallback(
    (
      targetMediaComponentText: string,
      targetMediaComponentTextPos: number[]
    ) => {
      // make current text shrink
      setYellowTextOffsetXCoeff(-1);

      setTimeout(() => {
        setYellowTextPosX(targetMediaComponentTextPos[0]);
        setYellowTextPosY(targetMediaComponentTextPos[1]);
      }, 400);

      setTimeout(() => {
        setYellowText(targetMediaComponentText);
      }, 1000);

      setTimeout(() => {
        // unshrink text
        setYellowTextOffsetXCoeff(0);
      }, 1200);
    },
    [
      setYellowText,
      setYellowTextOffsetXCoeff,
      setYellowTextPosX,
      setYellowTextPosY,
    ]
  );

  const initializeYellowTextForMediaScene = useCallback(() => {
    setTimeout(() => {
      setYellowText("Play");
      setYellowTextPosX(-0.8);
      setYellowTextPosY(0.05);
    }, 3950);
  }, [setYellowText, setYellowTextPosX, setYellowTextPosY]);

  const initializeYellowTextForMainScene = useCallback(
    (activeNodeId: string, level: string) => {
      setYellowText((site_a as SiteType)[level][activeNodeId].node_name);
      setYellowTextPosX(
        node_huds[activeNodeId as keyof typeof node_huds].big_text[0]
      );
      setYellowTextPosY(
        node_huds[activeNodeId as keyof typeof node_huds].big_text[1]
      );
    },
    [setYellowText, setYellowTextPosX, setYellowTextPosY]
  );

  const dispatchObject = useCallback(
    (
      event: string,
      newActiveHudId: string | undefined,
      newActiveNodeId: string | undefined,
      newLevel: string
    ) => {
      switch (event) {
        case "move_up":
          return {
            action: animateYellowTextWithMove,
            value: [0, -1.5, newActiveHudId, newActiveNodeId, newLevel, 1300],
          };
        case "move_down":
          return {
            action: animateYellowTextWithMove,
            value: [0, 1.5, newActiveHudId, newActiveNodeId, newLevel, 1300],
          };
        case "move_left":
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
        case "move_right":
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
        case "exit_up":
          return {
            action: animateMediaYellowText,
            value: ["Play", [-0.8, 0.05, 0.6]],
          };
        case "change_node":
          return {
            action: animateYellowTextWithoutMove,
            value: [newActiveHudId, newActiveNodeId, newLevel],
          };
        case "play_down":
          return {
            action: animateMediaYellowText,
            value: ["Exit", [-0.8, -0.08, 0.6]],
          };
        case "throw_node_media":
          return {
            action: initializeYellowTextForMediaScene,
          };
        case "exit_media_scene":
          return {
            action: initializeYellowTextForMainScene,
            value: [newActiveNodeId, newLevel],
          };
      }
    },
    [
      animateMediaYellowText,
      animateYellowTextWithMove,
      animateYellowTextWithoutMove,
      initializeYellowTextForMainScene,
      initializeYellowTextForMediaScene,
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
    props.newActiveHudId,
    props.newActiveNodeId,
    dispatchObject,
  ]);

  return null;
};

export default YellowTextManager;
