import { useCallback, useEffect } from "react";
import { useNodeStore } from "../../store";
import { StateManagerProps } from "./EventManager";

const NodeManager = (props: StateManagerProps) => {
  const setActiveNodeState = useNodeStore((state) => state.setActiveNodeState);
  const setNodeMatrixIndices = useNodeStore(
    (state) => state.setNodeMatrixIndices
  );

  const animateActiveNodeThrow = useCallback(() => {
    setActiveNodeState(true, "interactedWith");

    setActiveNodeState(0.3, "posZ");
    setActiveNodeState(0.9, "posX");

    setTimeout(() => {
      setActiveNodeState(0.2, "posZ");
      setActiveNodeState(0.5, "posX");
    }, 800);
    setTimeout(() => {
      setActiveNodeState(1.55, "posX");
      setActiveNodeState(-0.005, "rotZ");
    }, 2600);
    setTimeout(() => {
      setActiveNodeState(2, "posZ");
      setActiveNodeState(0, "posX");
      setActiveNodeState(-0.5, "rotZ");
    }, 2700);

    setTimeout(() => {
      setActiveNodeState(0, "rotZ");
      setActiveNodeState(false, "interactedWith");
    }, 3800);
  }, [setActiveNodeState]);

  const updateActiveNode = useCallback(
    (
      delay: number,
      isMoving: boolean,
      newActiveNodeId: string,
      newNodeMatrixIndices: {
        matrixIdx: number;
        rowIdx: number;
        colIdx: number;
      }
    ) => {
      setTimeout(() => {
        setActiveNodeState(newActiveNodeId, "id");
        setNodeMatrixIndices(newNodeMatrixIndices);
      }, delay);
    },
    [setActiveNodeState, setNodeMatrixIndices]
  );

  const dispatchObject = useCallback(
    (
      event: string,
      newActiveNodeId: string,
      newNodeMatrixIndices: {
        matrixIdx: number;
        rowIdx: number;
        colIdx: number;
      }
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
            value: [3900, true, newActiveNodeId, newNodeMatrixIndices],
          };
        case "change_node":
          return {
            action: updateActiveNode,
            value: [0, false, newActiveNodeId, newNodeMatrixIndices],
          };
        case "throw_node_media":
        case "throw_node_gate":
        case "throw_node_sskn":
          return {
            action: animateActiveNodeThrow,
            value: [0, true],
          };
      }
    },
    [animateActiveNodeThrow, updateActiveNode]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newActiveNodeId = props.eventState.newActiveNodeId;
      const newNodeMatrixIndices = props.eventState.newNodeMatrixIndices;

      const dispatchedObject = dispatchObject(
        eventAction,
        newActiveNodeId,
        newNodeMatrixIndices
      );

      if (dispatchedObject) {
        dispatchedObject.action.apply(null, dispatchedObject.value as never);
      }
    }
  }, [props.eventState, setActiveNodeState, dispatchObject]);
  return null;
};

export default NodeManager;
