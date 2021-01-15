import { useCallback, useEffect } from "react";
import {
  useBigTextStore,
  useGreenTextStore,
  useHudStore,
  useLevelStore,
  useNodeStore,
  useSiteSaveStore,
  useSiteStore,
} from "../../../store";
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
  const setActiveLevel = useLevelStore((state) => state.setActiveLevel);

  // yellow text setter
  const setYellowTextTransformState = useBigTextStore(
    (state) => state.setTransformState
  );
  const setYellowText = useBigTextStore((state) => state.setText);

  // green text setter
  const setGreenText = useGreenTextStore((state) => state.setText);
  const setGreenTextTransformState = useGreenTextStore(
    (state) => state.setTransformState
  );

  // site setter
  const setSiteTransformState = useSiteStore(
    (state) => state.setTransformState
  );
  const setCurrentSite = useSiteStore((state) => state.setCurrentSite);

  // node setter
  const setActiveNodeState = useNodeStore((state) => state.setActiveNodeState);
  const setNodeMatrixIndices = useNodeStore(
    (state) => state.setNodeMatrixIndices
  );

  // node hud setter
  const setHudId = useHudStore((state) => state.setId);

  const changeSite = useCallback(
    (site: string) => {
      // load new site
      const siteToLoad = site === "a" ? siteASaveState : siteBSaveState;
      const siteData = site === "a" ? site_a : site_b;

      // load new site (the object itself)
      setSiteTransformState(0, "rotX");

      setCurrentSite(site);
      setSiteTransformState(siteToLoad.siteRotY, "rotY");
      setSiteTransformState(siteToLoad.sitePosY, "posY");

      // load new site level
      setActiveLevel(siteToLoad.level);

      // load new site yellow text
      setYellowTextTransformState(
        node_huds[siteToLoad.nodeHudId as keyof typeof node_huds].big_text[0],
        "posX"
      );
      setYellowTextTransformState(
        node_huds[siteToLoad.nodeHudId as keyof typeof node_huds].big_text[1],
        "posY"
      );

      const targetYellowText = (siteData as SiteType)[siteToLoad.level][
        siteToLoad.activeNodeId
      ].node_name;

      setYellowText(targetYellowText);

      // load new site green text

      const targetGreenText = (siteData as SiteType)[siteToLoad.level][
        siteToLoad.activeNodeId
      ].title;

      const targetGreenTextPosData =
        node_huds[siteToLoad.nodeHudId as keyof typeof node_huds].medium_text;

      setGreenTextTransformState(
        {
          initial: targetGreenTextPosData.initial_position[0],
          final: targetGreenTextPosData.position[0],
        },
        "posX"
      );
      setGreenTextTransformState(targetGreenTextPosData.position[1], "posY");
      setGreenText(targetGreenText);

      // load new site node
      setActiveNodeState(siteToLoad.activeNodeId, "id");
      setNodeMatrixIndices(siteToLoad.nodeMatrixIndices);

      // load new site node hud
      setHudId(siteToLoad.nodeHudId);
    },
    [
      setActiveLevel,
      setActiveNodeState,
      setCurrentSite,
      setGreenText,
      setGreenTextTransformState,
      setHudId,
      setNodeMatrixIndices,
      setSiteTransformState,
      setYellowText,
      setYellowTextTransformState,
      siteASaveState,
      siteBSaveState,
    ]
  );

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
