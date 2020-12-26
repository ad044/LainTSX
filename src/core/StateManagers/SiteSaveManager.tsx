import { useCallback, useEffect } from "react";
import { useSiteSaveStore } from "../../store";
import { StateManagerProps } from "./EventManager";

const SiteSaveManager = (props: StateManagerProps) => {
  const setSiteSaveState = useSiteSaveStore((state) => state.setSiteSaveState);

  const dispatchObject = useCallback(
    (
      event: string,
      sitePosY: number,
      siteRotY: number,
      currentSite: string,
      newSite: string,
      activeNodeId: string,
      activeNodeMatrixIndices: {
        matrixIdx: number;
        rowIdx: number;
        colIdx: number;
      },
      level: string
    ) => {
      switch (event) {
        case "pause_change_select":
          return {
            action: setSiteSaveState,
            value: [
              currentSite,
              {
                activeNodeId: activeNodeId,
                nodeMatrixIndices: activeNodeMatrixIndices,
                siteRotY: siteRotY,
                sitePosY: sitePosY,
                level: level.toString().padStart(2, "0"),
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
      const eventAction = props.eventState.event;
      const siteRotY = props.eventState.currentSiteRotY;
      const sitePosY = props.eventState.currentSitePosY;
      const activeNodeId = props.eventState.currentActiveNodeId;
      const activeNodeMatrixIndices =
        props.eventState.currentActiveNodeMatrixIndices;
      const newLevel = props.eventState.currentLevel;

      const currentSite = props.eventState.currentSite;
      const newSite = props.eventState.newSite;

      const dispatchedObject = dispatchObject(
        eventAction,
        sitePosY,
        siteRotY,
        currentSite,
        newSite,
        activeNodeId,
        activeNodeMatrixIndices,
        newLevel
      );

      if (dispatchedObject) {
        setTimeout(() => {
          dispatchedObject.action.apply(null, dispatchedObject.value as any);
        }, dispatchedObject.actionDelay);
      }
    }
  }, [dispatchObject, props.eventState]);
  return null;
};

export default SiteSaveManager;
