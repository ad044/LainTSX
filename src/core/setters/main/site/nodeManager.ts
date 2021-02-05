import { useStore } from "../../../../store";
import { NodeDataType } from "../../../../components/MainScene/Site";

const nodeManager = (eventState: any) => {
  const setActiveNode = useStore.getState().setNode;
  const setActiveNodePos = useStore.getState().setNodePos;
  const setActiveNodeRot = useStore.getState().setNodeRot;
  const setActiveNodeState = useStore.getState().setNodeState;

  const calculateCoordsBasedOnRotation = (
    x: number,
    z: number,
    rotation: number
  ) => ({
    x: x * Math.cos(rotation) - z * Math.sin(rotation),
    z: x * Math.sin(rotation) + z * Math.cos(rotation),
  });

  const animateActiveNodeThrow = (siteRotY: number) => {
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
  };

  const animateNodeKnock = (siteRotY: number) => {
    setActiveNodeState(true, "interactedWith");

    const fstCoordSet = calculateCoordsBasedOnRotation(1.1, 0.2, siteRotY);

    setActiveNodePos([fstCoordSet.x, -0.6, fstCoordSet.z]);

    setTimeout(() => {
      setActiveNodeState(false, "interactedWith");
    }, 2500);
  };

  const animateNodeKnockAndFall = (siteRotY: number) => {
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
  };

  const animateNodeTouchAndScare = (siteRotY: number) => {
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
  };

  const animateShrinkAndRip = (siteRotY: number) => {
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
  };

  const updateActiveNode = (node: NodeDataType, delay?: number) => {
    setTimeout(() => {
      setActiveNode(node);
    }, delay);
  };

  const dispatchAction = (eventState: any) => {
    switch (eventState.event) {
      case "touch_and_scare":
        return {
          action: () => animateNodeTouchAndScare(eventState.siteRotY),
        };
      case "knock_and_fall":
        return {
          action: () => animateNodeKnockAndFall(eventState.siteRotY),
        };
      case "knock":
        return {
          action: () => animateNodeKnock(eventState.siteRotY),
        };
      case "site_up":
      case "site_down":
      case "site_left":
      case "site_right":
      case "select_level_up":
      case "select_level_down":
        return {
          action: () => updateActiveNode(eventState.node, 3900),
        };
      case "change_node":
      case "media_fstWord_select":
      case "media_sndWord_select":
      case "media_thirdWord_select":
        return {
          action: () => updateActiveNode(eventState.node),
        };
      case "throw_node_media":
      case "throw_node_gate":
      case "throw_node_sskn":
      case "throw_node_tak":
      case "throw_node_polytan":
        return {
          action: () => animateActiveNodeThrow(eventState.siteRotY),
        };
      case "rip_node_media":
      case "rip_node_gate":
      case "rip_node_sskn":
      case "rip_node_tak":
      case "rip_node_polytan":
        return {
          action: () => animateShrinkAndRip(eventState.siteRotY),
        };
    }
  };

  const { action } = { ...dispatchAction(eventState) };

  if (action) {
    action();
  }
};

export default nodeManager;
