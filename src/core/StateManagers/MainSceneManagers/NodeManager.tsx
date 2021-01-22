import { useCallback, useEffect } from "react";
import { useMainSceneStore } from "../../../store";
import { StateManagerProps } from "../EventManager";
import { NodeDataType } from "../../../components/MainScene/SyncedComponents/Site";

const NodeManager = (props: StateManagerProps) => {
  const setActiveNode = useMainSceneStore((state) => state.setNode);
  const setActiveNodePos = useMainSceneStore((state) => state.setNodePos);
  const setActiveNodeRot = useMainSceneStore((state) => state.setNodeRot);
  const setActiveNodeState = useMainSceneStore((state) => state.setNodeState);
  const setNodeMatrixIndices = useMainSceneStore(
    (state) => state.setNodeMatrixIndices
  );

  const calculateCoordsBasedOnRotation = (
    x: number,
    z: number,
    rotation: number
  ) => ({
    x: x * Math.cos(rotation) - z * Math.sin(rotation),
    z: x * Math.sin(rotation) + z * Math.cos(rotation),
  });

  const animateActiveNodeThrow = useCallback(
    (siteRotY: number) => {
      setActiveNodeState(true, "interactedWith");

      const fstCoordSet = calculateCoordsBasedOnRotation(0.9, 0.3, siteRotY);
      const sndCoordSet = calculateCoordsBasedOnRotation(0.5, 0.2, siteRotY);
      const thirdCoordSet = calculateCoordsBasedOnRotation(1.55, 0.2, siteRotY);
      const fourthCoordSet = calculateCoordsBasedOnRotation(0, 2, siteRotY);

      setActiveNodePos([fstCoordSet.x, 0, fstCoordSet.z]);

      setTimeout(() => {
        setActiveNodePos([sndCoordSet.x, 0, sndCoordSet.z]);
      }, 800);
      setTimeout(() => {
        setActiveNodePos([thirdCoordSet.x, 0, sndCoordSet.z]);
        setActiveNodeRot([0, 0, -0.005]);
      }, 2600);
      setTimeout(() => {
        setActiveNodePos([fourthCoordSet.x, 0, fourthCoordSet.z]);
        setActiveNodeRot([0, 0, -0.5]);
      }, 2700);

      setTimeout(() => {
        setActiveNodeRot([0, 0, 0]);
        setActiveNodeState(false, "interactedWith");
      }, 3800);
    },
    [setActiveNodePos, setActiveNodeRot, setActiveNodeState]
  );

  const animateNodeKnock = useCallback(
    (siteRotY: number) => {
      setActiveNodeState(true, "interactedWith");

      const fstCoordSet = calculateCoordsBasedOnRotation(1.1, 0.2, siteRotY);

      setActiveNodePos([fstCoordSet.x, -0.6, fstCoordSet.z]);

      setTimeout(() => {
        setActiveNodeState(false, "interactedWith");
      }, 2500);
    },
    [setActiveNodePos, setActiveNodeState]
  );

  const animateNodeKnockAndFall = useCallback(
    (siteRotY: number) => {
      setActiveNodeState(true, "interactedWith");

      const fstCoordSet = calculateCoordsBasedOnRotation(1.1, 0.2, siteRotY);

      setActiveNodePos([fstCoordSet.x, -0.6, fstCoordSet.z]);

      setTimeout(() => {
        setActiveNodeState(false, "visible");
      }, 2300);

      setTimeout(() => {
        setActiveNodeState(false, "interactedWith");
      }, 2500);

      setTimeout(() => {
        setActiveNodeState(true, "visible");
      }, 3200);
    },
    [setActiveNodePos, setActiveNodeState]
  );

  const animateNodeTouchAndScare = useCallback(
    (siteRotY: number) => {
      setActiveNodeState(true, "interactedWith");

      const fstCoordSet = calculateCoordsBasedOnRotation(-0.6, 0.2, siteRotY);

      setActiveNodePos([fstCoordSet.x, 0, fstCoordSet.z]);

      setTimeout(() => {
        setActiveNodeState(true, "exploding");
        setActiveNodeState(false, "visible");
      }, 1200);

      setTimeout(() => {
        setActiveNodeState(false, "interactedWith");
        setActiveNodeRot([0, 0, 0]);
      }, 1400);

      setTimeout(() => {
        setActiveNodeState(false, "exploding");
      }, 3150);

      setTimeout(() => {
        setActiveNodeState(true, "visible");
      }, 3500);
    },
    [setActiveNodePos, setActiveNodeRot, setActiveNodeState]
  );

  const animateShrinkAndRip = useCallback(
    (siteRotY: number) => {
      setActiveNodeState(true, "interactedWith");

      const fstCoordSet = calculateCoordsBasedOnRotation(0.9, 0.3, siteRotY);
      const sndCoordSet = calculateCoordsBasedOnRotation(0.5, 0.2, siteRotY);
      const thirdCoordSet = calculateCoordsBasedOnRotation(0, 0.2, siteRotY);

      setActiveNodePos([fstCoordSet.x, 0, fstCoordSet.z]);

      setTimeout(() => {
        setActiveNodePos([sndCoordSet.x, 0, sndCoordSet.z]);
      }, 800);

      setTimeout(() => {
        setActiveNodePos([thirdCoordSet.x, -0.4, thirdCoordSet.z]);
      }, 2800);

      setTimeout(() => {
        setActiveNodeState(true, "shrinking");
      }, 3000);

      setTimeout(() => {
        setActiveNodePos([thirdCoordSet.x, -1.5, thirdCoordSet.z]);
      }, 3200);

      setTimeout(() => {
        setActiveNodeState(false, "visible");
      }, 3500);

      setTimeout(() => {
        setActiveNodeState(false, "interactedWith");
        setActiveNodeState(false, "shrinking");
        setActiveNodeRot([0, 0, 0]);
      }, 6400);

      setTimeout(() => {
        setActiveNodeState(true, "visible");
      }, 7500);
    },
    [setActiveNodePos, setActiveNodeRot, setActiveNodeState]
  );

  const updateActiveNode = useCallback(
    (
      node: NodeDataType,
      newNodeMatrixIndices: {
        matrixIdx: number;
        rowIdx: number;
        colIdx: number;
      },
      isMoving?: boolean,
      delay?: number
    ) => {
      setTimeout(() => {
        setActiveNode(node);
        setNodeMatrixIndices(newNodeMatrixIndices);
      }, delay);
    },
    [setActiveNode, setNodeMatrixIndices]
  );

  const dispatchObject = useCallback(
    (eventState: {
      event: string;
      node: NodeDataType;
      nodeMatrixIndices: {
        matrixIdx: number;
        rowIdx: number;
        colIdx: number;
      };
      siteRotY: number;
      idleNodeId?: string;
    }) => {
      switch (eventState.event) {
        case "site_up":
        case "site_down":
        case "site_left":
        case "site_right":
        case "select_level_up":
        case "select_level_down":
          return {
            action: updateActiveNode,
            value: [eventState.node, eventState.nodeMatrixIndices, true, 3900],
          };
        case "change_node":
          return {
            action: updateActiveNode,
            value: [eventState.node, eventState.nodeMatrixIndices],
          };
        case "throw_node_media":
        case "throw_node_gate":
        case "throw_node_sskn":
        case "throw_node_tak":
          return {
            action: animateActiveNodeThrow,
            value: [eventState.siteRotY],
          };
        case "rip_node_media":
        case "rip_node_gate":
        case "rip_node_sskn":
        case "rip_node_tak":
          return {
            action: animateShrinkAndRip,
            value: [eventState.siteRotY],
          };
      }
    },
    [animateActiveNodeThrow, animateShrinkAndRip, updateActiveNode]
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedObject = dispatchObject(props.eventState);

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
