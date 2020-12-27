import { useCallback, useEffect } from "react";
import { useSiteSaveStore, useSiteStore } from "../../store";
import { StateManagerProps } from "./EventManager";

const SiteManager = (props: StateManagerProps) => {
  const setTransformState = useSiteStore((state) => state.setTransformState);
  const setCurrentSite = useSiteStore((state) => state.setCurrentSite);

  const siteASaveState = useSiteSaveStore((state) => state.a);
  const siteBSaveState = useSiteSaveStore((state) => state.b);

  const changeSite = useCallback(
    (newSite: string) => {
      setTransformState(0, "rotX");

      const siteToLoad = newSite === "a" ? siteASaveState : siteBSaveState;

      setCurrentSite(newSite);
      setTransformState(siteToLoad.siteRotY, "rotY");
      setTransformState(siteToLoad.sitePosY, "posY");
    },
    [setCurrentSite, setTransformState, siteASaveState, siteBSaveState]
  );

  const dispatchObject = useCallback(
    (
      event: string,
      newSitePosY: number,
      newSiteRotY: number,
      currentSite: string,
      newSite: string
    ) => {
      switch (event) {
        case "site_up":
        case "site_down":
        case "select_level_up":
        case "select_level_down":
          return {
            action: setTransformState,
            value: [newSitePosY, "posY"],
            actionDelay: 1300,
          };
        case "site_left":
        case "site_right":
          return {
            action: setTransformState,
            value: [newSiteRotY, "rotY"],
            actionDelay: 1100,
          };
        case "pause_game":
          return {
            action: setTransformState,
            value: [Math.PI / 2, "rotX"],
            actionDelay: 0,
          };
        case "pause_exit_select":
          return {
            action: setTransformState,
            value: [0, "rotX"],
            actionDelay: 0,
          };
        case "pause_change_select":
          return {
            action: changeSite,
            value: [newSite],
            actionDelay: 0,
          };
      }
    },
    [changeSite, setTransformState]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newSiteRotY = props.eventState.newSiteRotY;
      const newSitePosY = props.eventState.newSitePosY;

      const currentSite = props.eventState.currentSite;
      const newSite = props.eventState.newSite;

      const dispatchedObject = dispatchObject(
        eventAction,
        newSitePosY,
        newSiteRotY,
        currentSite,
        newSite
      );

      if (dispatchedObject) {
        setTimeout(() => {
          (dispatchedObject.action as any).apply(
            null,
            dispatchedObject.value as any
          );
        }, dispatchedObject.actionDelay);
      }
    }
  }, [dispatchObject, props.eventState]);
  return null;
};

export default SiteManager;
