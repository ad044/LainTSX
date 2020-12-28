import { useCallback, useEffect } from "react";
import { useSiteSaveStore } from "../../store";
import { StateManagerProps } from "./EventManager";

const GameSaver = (props: StateManagerProps) => {
  const setSiteSaveState = useSiteSaveStore((state) => state.setSiteSaveState);

  const dispatchObject = useCallback(
    (eventState: {
      event: string;
      currentSitePosY: number;
      currentSiteRotY: number;
      currentNodeId: string;
      currentNodeMatrixIndices: {
        matrixIdx: number;
        rowIdx: number;
        colIdx: number;
      };
      currentHudId: string;
      currentLevel: string;
      site: string;
    }) => {
      switch (eventState.event) {
        case "pause_change_select":
          return {
            action: setSiteSaveState,
            value: [
              eventState.site === "a" ? "b" : "a",
              {
                activeNodeId: eventState.currentNodeId,
                nodeMatrixIndices: eventState.currentNodeMatrixIndices,
                nodeHudId: eventState.currentHudId,
                siteRotY: eventState.currentSiteRotY,
                sitePosY: eventState.currentSitePosY,
                level: eventState.currentLevel,
              },
            ],
            actionDelay: 0,
          };
      }
    },
    [setSiteSaveState]
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedObject = dispatchObject(props.eventState);

      if (dispatchedObject) {
        setTimeout(() => {
          dispatchedObject.action.apply(null, dispatchedObject.value as any);
        }, dispatchedObject.actionDelay);
      }
    }
  }, [dispatchObject, props.eventState]);
  return null;
};

export default GameSaver;
