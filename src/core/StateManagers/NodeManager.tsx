import { useCallback, useEffect } from "react";
import { useNodeStore, useSiteSaveStore } from "../../store";
import { StateManagerProps } from "./EventManager";

const NodeManager = (props: StateManagerProps) => {
  const setActiveNodeState = useNodeStore((state) => state.setActiveNodeState);
  const setNodeMatrixIndices = useNodeStore(
    (state) => state.setNodeMatrixIndices
  );
  const siteASaveState = useSiteSaveStore((state) => state.a);
  const siteBSaveState = useSiteSaveStore((state) => state.b);

  const animateActiveNodeThrow = useCallback(
    (siteRotY: number) => {
      setActiveNodeState(true, "interactedWith");

      const calculateCoordsBasedOnRotation = (
        x: number,
        z: number,
        rotation: number
      ) => ({
        x: x * Math.cos(rotation) - z * Math.sin(rotation),
        z: x * Math.sin(rotation) + z * Math.cos(rotation),
      });

      const fstCoordSet = calculateCoordsBasedOnRotation(0.9, 0.3, siteRotY);
      const sndCoordSet = calculateCoordsBasedOnRotation(0.5, 0.2, siteRotY);
      const thirdCoordSet = calculateCoordsBasedOnRotation(1.55, 0.2, siteRotY);
      const fourthCoordSet = calculateCoordsBasedOnRotation(0, 2, siteRotY);

      setActiveNodeState(fstCoordSet.x, "posX");
      setActiveNodeState(fstCoordSet.z, "posZ");

      setTimeout(() => {
        setActiveNodeState(sndCoordSet.x, "posX");
        setActiveNodeState(sndCoordSet.z, "posZ");
      }, 800);
      setTimeout(() => {
        setActiveNodeState(thirdCoordSet.x, "posX");
        setActiveNodeState(-0.005, "rotZ");
      }, 2600);
      setTimeout(() => {
        setActiveNodeState(fourthCoordSet.x, "posX");
        setActiveNodeState(fourthCoordSet.z, "posZ");
        setActiveNodeState(-0.5, "rotZ");
      }, 2700);

      setTimeout(() => {
        setActiveNodeState(0, "rotZ");
        setActiveNodeState(false, "interactedWith");
      }, 3800);
    },
    [setActiveNodeState]
  );

  const updateActiveNode = useCallback(
    (
      newActiveNodeId: string,
      newNodeMatrixIndices: {
        matrixIdx: number;
        rowIdx: number;
        colIdx: number;
      },
      isMoving?: boolean,
      delay?: number
    ) => {
      setTimeout(() => {
        setActiveNodeState(newActiveNodeId, "id");
        setNodeMatrixIndices(newNodeMatrixIndices);
      }, delay);
    },
    [setActiveNodeState, setNodeMatrixIndices]
  );

  const setAfterChangeSite = useCallback(
    (newSite: string) => {
      const siteToLoad = newSite === "a" ? siteASaveState : siteBSaveState;
      setActiveNodeState(siteToLoad.activeNodeId, "id");
      setNodeMatrixIndices(siteToLoad.nodeMatrixIndices);
    },
    [setActiveNodeState, setNodeMatrixIndices, siteASaveState, siteBSaveState]
  );

  const dispatchObject = useCallback(
    (
      event: string,
      newActiveNodeId: string,
      newNodeMatrixIndices: {
        matrixIdx: number;
        rowIdx: number;
        colIdx: number;
      },
      newSiteRotY: number,
      newSite: string
    ) => {
      switch (event) {
        case "site_up":
        case "site_down":
        case "site_left":
        case "site_right":
        case "select_level_up":
        case "select_level_down":
          return {
            action: updateActiveNode,
            value: [newActiveNodeId, newNodeMatrixIndices, true, 3900],
          };
        case "change_node":
          return {
            action: updateActiveNode,
            value: [newActiveNodeId, newNodeMatrixIndices],
          };
        case "pause_change_select":
          return {
            action: setAfterChangeSite,
            value: [newSite],
          };
        case "throw_node_media":
        case "throw_node_gate":
        case "throw_node_sskn":
        case "throw_node_tak":
          return {
            action: animateActiveNodeThrow,
            value: [newSiteRotY],
          };
      }
    },
    [animateActiveNodeThrow, setAfterChangeSite, updateActiveNode]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newActiveNodeId = props.eventState.newActiveNodeId;
      const newNodeMatrixIndices = props.eventState.newNodeMatrixIndices;

      const newSiteRotY = props.eventState.newSiteRotY;
      const newSite = props.eventState.newSite;

      const dispatchedObject = dispatchObject(
        eventAction,
        newActiveNodeId,
        newNodeMatrixIndices,
        newSiteRotY,
        newSite
      );

      if (dispatchedObject) {
        (dispatchedObject.action as any).apply(
          null,
          dispatchedObject.value as never
        );
      }
    }
  }, [props.eventState, setActiveNodeState, dispatchObject]);
  return null;
};

export default NodeManager;
