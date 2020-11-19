import { useCallback, useEffect } from "react";
import { useNodeStore } from "../../store";
import { StateManagerProps } from "./EventManager";

type SetIsActiveNodeInteractedWith = (value: boolean) => void;

const NodeManager = (props: StateManagerProps) => {
  const setActiveNode = useNodeStore((state) => state.setActiveNodeId);
  const setNodeMatrixIndices = useNodeStore(
    (state) => state.setNodeMatrixIndices
  );

  const setIsActiveNodeInteractedWith: SetIsActiveNodeInteractedWith = useNodeStore(
    (state) => state.setIsActiveNodeInteractedWith
  );
  const setActiveNodePosX = useNodeStore((state) => state.setActiveNodePosX);
  const setActiveNodePosZ = useNodeStore((state) => state.setActiveNodePosZ);
  const setActiveNodeRotZ = useNodeStore((state) => state.setActiveNodeRotZ);

  const animateActiveNodeThrow = useCallback(() => {
    setIsActiveNodeInteractedWith(true);

    setActiveNodePosZ(0.3);
    setActiveNodePosX(0.9);

    setTimeout(() => {
      setActiveNodePosZ(0.2);
      setActiveNodePosX(0.5);
    }, 800);
    setTimeout(() => {
      setActiveNodePosX(1.55);
      setActiveNodeRotZ(-0.005);
    }, 2600);
    setTimeout(() => {
      setActiveNodePosZ(2);
      setActiveNodePosX(0);
      setActiveNodeRotZ(-0.5);
    }, 2700);

    setTimeout(() => {
      setActiveNodeRotZ(0);
      setIsActiveNodeInteractedWith(false);
    }, 3800);
  }, [
    setActiveNodePosX,
    setActiveNodePosZ,
    setActiveNodeRotZ,
    setIsActiveNodeInteractedWith,
  ]);

  const updateActiveNode = useCallback(
    (
      delay: number,
      isMoving: boolean,
      newActiveNodeId: string,
      newNodeColIdx: number,
      newNodeRowIdx: number
    ) => {
      setTimeout(() => {
        setActiveNode(newActiveNodeId);
        setNodeMatrixIndices({
          rowIdx: newNodeRowIdx,
          colIdx: newNodeColIdx,
        });
      }, delay);
    },
    [setActiveNode, setNodeMatrixIndices]
  );

  const dispatchObject = useCallback(
    (
      event: string,
      newActiveNodeId: string,
      newNodeColIdx: number,
      newNodeRowIdx: number
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
            ],
          };
        case "change_node":
          return {
            action: updateActiveNode,
            value: [0, false, newActiveNodeId, newNodeColIdx, newNodeRowIdx],
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
      const newNodeRowIdx = props.eventState.newNodeRowIdx;
      const newNodeColIdx = props.eventState.newNodeColIdx;

      const dispatchedObject = dispatchObject(
        eventAction,
        newActiveNodeId,
        newNodeColIdx,
        newNodeRowIdx
      );

      if (dispatchedObject) {
        dispatchedObject.action.apply(null, dispatchedObject.value as never);
      }
    }
  }, [props.eventState, setActiveNode, dispatchObject]);
  return null;
};

export default NodeManager;
