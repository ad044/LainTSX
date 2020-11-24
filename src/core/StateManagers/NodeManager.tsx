import { useCallback, useEffect } from "react";
import { useNodeStore } from "../../store";
import { StateManagerProps } from "./EventManager";

const NodeManager = (props: StateManagerProps) => {
  const setActiveNodeState = useNodeStore((state) => state.setActiveNodeState);
  const setNodeMatrixIndices = useNodeStore(
    (state) => state.setNodeMatrixIndices
  );

  // const animateActiveNodeThrow = useCallback(() => {
  //   setIsActiveNodeInteractedWith(true);
  //
  //   setActiveNodePosZ(0.3);
  //   setActiveNodePosX(0.9);
  //
  //   setTimeout(() => {
  //     setActiveNodePosZ(0.2);
  //     setActiveNodePosX(0.5);
  //   }, 800);
  //   setTimeout(() => {
  //     setActiveNodePosX(1.55);
  //     setActiveNodeRotZ(-0.005);
  //   }, 2600);
  //   setTimeout(() => {
  //     setActiveNodePosZ(2);
  //     setActiveNodePosX(0);
  //     setActiveNodeRotZ(-0.5);
  //   }, 2700);
  //
  //   setTimeout(() => {
  //     setActiveNodeRotZ(0);
  //     setIsActiveNodeInteractedWith(false);
  //   }, 3800);
  // }, []);

  const updateActiveNode = useCallback(
    (
      delay: number,
      isMoving: boolean,
      newActiveNodeId: string,
      newNodeColIdx: number,
      newNodeRowIdx: number,
      newNodeMatIdx: number
    ) => {
      setTimeout(() => {
        setActiveNodeState(newActiveNodeId, "id");
        setNodeMatrixIndices({
          matrixIdx: newNodeMatIdx,
          rowIdx: newNodeRowIdx,
          colIdx: newNodeColIdx,
        });
      }, delay);
    },
    [setActiveNodeState, setNodeMatrixIndices]
  );

  const dispatchObject = useCallback(
    (
      event: string,
      newActiveNodeId: string,
      newNodeColIdx: number,
      newNodeRowIdx: number,
      newNodeMatIdx: number
    ) => {
      switch (event) {
        case "move_up":
        case "move_down":
        case "move_left":
        case "move_right":
          return {
            action: updateActiveNode,
            value: [
              3903.704,
              true,
              newActiveNodeId,
              newNodeColIdx,
              newNodeRowIdx,
              newNodeMatIdx,
            ],
          };
        case "change_node":
          return {
            action: updateActiveNode,
            value: [
              0,
              false,
              newActiveNodeId,
              newNodeColIdx,
              newNodeRowIdx,
              newNodeMatIdx,
            ],
          };
        // case "throw_node_media":
        // case "throw_node_gate":
        // case "throw_node_sskn":
        //   return {
        //     action: animateActiveNodeThrow,
        //     value: [0, true],
        //   };
      }
    },
    [updateActiveNode]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newActiveNodeId = props.eventState.newActiveNodeId;
      const newNodeRowIdx = props.eventState.newNodeRowIdx;
      const newNodeColIdx = props.eventState.newNodeColIdx;
      const newNodeMatIdx = props.eventState.newNodeMatIdx;

      const dispatchedObject = dispatchObject(
        eventAction,
        newActiveNodeId,
        newNodeColIdx,
        newNodeRowIdx,
        newNodeMatIdx
      );

      if (dispatchedObject) {
        dispatchedObject.action.apply(null, dispatchedObject.value as never);
      }
    }
  }, [props.eventState, setActiveNodeState, dispatchObject]);
  return null;
};

export default NodeManager;
