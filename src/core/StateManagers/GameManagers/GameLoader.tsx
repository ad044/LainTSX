import { useCallback, useEffect } from "react";
import { useStore, useSiteSaveStore } from "../../../store";
import { StateManagerProps } from "../EventManager";
import node_huds from "../../../resources/node_huds.json";
import site_a from "../../../resources/site_a.json";
import site_b from "../../../resources/site_b.json";
import { SiteType } from "../../../components/MainScene/SyncedComponents/Site";

const GameLoader = (props: StateManagerProps) => {
  const siteASaveState = useSiteSaveStore((state) => state.a);
  const siteBSaveState = useSiteSaveStore((state) => state.b);

  // setters for components, setting them all like this instead of their respective ones
  // makes more sense since they all needed extra bit of context just for this certain event,
  // which imo didn't make much sense

  // level setter
  // const setActiveLevel = useLevelStore((state) => state.setActiveLevel);

  // site setter
  const setSiteRot = useStore((state) => state.setSiteRot);
  const setCurrentSite = useStore((state) => state.setActiveSite);

  // node setter
  const setActiveNode = useStore((state) => state.setNode);

  // node hud setter
  const setHud = useStore((state) => state.setHud);

  const changeSite = useCallback((site: string) => {
    // load new site
    // const siteToLoad = site === "a" ? siteASaveState : siteBSaveState;
    // const siteData = site === "a" ? site_a : site_b;
    //
    // // load new site (the object itself)
    // setCurrentSite(site);
    // setSiteRot(siteToLoad.siteRotY);
    // setSitePos(siteToLoad.sitePosY);
    //
    // // load new site level
    // setActiveLevel(siteToLoad.level);
    //
    // // load new site yellow text
    // setBigTexPos(
    //   node_huds[siteToLoad.nodeHudId as keyof typeof node_huds].big_text[0]
    // );
    //
    // const targetYellowText = (siteData as SiteType)[siteToLoad.level][
    //   siteToLoad.activeNodeId
    // ].node_name;
    //
    // setBigText(targetYellowText);
    //
    // // load new site node
    // setActiveNode(siteToLoad.activeNodeId);
    // setNodeMatrixIndices(siteToLoad.nodeMatrixIndices);
    //
    // // load new site node hud
    // setHud(siteToLoad.nodeHudId);
  }, []);

  const dispatchObject = useCallback(
    (eventState: { event: string; site: string }) => {
      switch (eventState.event) {
        case "pause_change_select":
          return {
            action: changeSite,
            value: [eventState.site],
            actionDelay: 0,
          };
      }
    },
    [changeSite]
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

export default GameLoader;
