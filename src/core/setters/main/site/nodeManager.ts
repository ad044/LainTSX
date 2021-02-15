import { useStore } from "../../../../store";
import { NodeDataType } from "../../../../components/MainScene/Site";
import sleep from "../../../../utils/sleep";

const nodeManager = (eventState: any) => {
  const setActiveNode = useStore.getState().setNode;
  const setActiveNodePos = useStore.getState().setNodePos;
  const setActiveNodeRot = useStore.getState().setNodeRot;
  const setActiveNodeAttributes = useStore.getState().setNodeAttributes;

  const calculateCoordsBasedOnRotation = (
    x: number,
    z: number,
    rotation: number
  ) => ({
    x: x * Math.cos(rotation) - z * Math.sin(rotation),
    z: x * Math.sin(rotation) + z * Math.cos(rotation),
  });

  const animateActiveNodeThrow = async (siteRotY: number) => {
    const fstCoordSet = calculateCoordsBasedOnRotation(0.9, 0.3, siteRotY);
    const sndCoordSet = calculateCoordsBasedOnRotation(0.5, 0.2, siteRotY);
    const thirdCoordSet = calculateCoordsBasedOnRotation(1.55, 0.2, siteRotY);
    const fourthCoordSet = calculateCoordsBasedOnRotation(0, 2, siteRotY);

    setActiveNodeAttributes(true, "interactedWith");

    setActiveNodePos([fstCoordSet.x, 0, fstCoordSet.z]);

    await sleep(800);
    setActiveNodePos([sndCoordSet.x, 0, sndCoordSet.z]);

    await sleep(1800);
    setActiveNodePos([thirdCoordSet.x, 0, sndCoordSet.z]);
    setActiveNodeRot([0, 0, -0.005]);

    await sleep(100);
    setActiveNodePos([fourthCoordSet.x, 0, fourthCoordSet.z]);
    setActiveNodeRot([0, 0, -0.5]);

    await sleep(1100);
    setActiveNodeRot([0, 0, 0]);
    setActiveNodeAttributes(false, "interactedWith");
  };

  const animateNodeKnock = async (siteRotY: number) => {
    const fstCoordSet = calculateCoordsBasedOnRotation(1.1, 0.2, siteRotY);

    setActiveNodeAttributes(true, "interactedWith");

    setActiveNodePos([fstCoordSet.x, -0.6, fstCoordSet.z]);

    await sleep(2500);
    setActiveNodeAttributes(false, "interactedWith");
  };

  const animateNodeKnockAndFall = async (siteRotY: number) => {
    const fstCoordSet = calculateCoordsBasedOnRotation(1.1, 0.2, siteRotY);

    setActiveNodeAttributes(true, "interactedWith");

    setActiveNodePos([fstCoordSet.x, -0.6, fstCoordSet.z]);

    await sleep(2300);
    setActiveNodeAttributes(false, "visible");

    await sleep(200);
    setActiveNodeAttributes(false, "interactedWith");

    await sleep(700);
    setActiveNodeAttributes(true, "visible");
  };

  const animateNodeTouchAndScare = async (siteRotY: number) => {
    const fstCoordSet = calculateCoordsBasedOnRotation(-0.6, 0.2, siteRotY);

    setActiveNodeAttributes(true, "interactedWith");

    setActiveNodePos([fstCoordSet.x, 0, fstCoordSet.z]);

    await sleep(1200);
    setActiveNodeAttributes(true, "exploding");
    setActiveNodeAttributes(false, "visible");

    await sleep(200);
    setActiveNodeAttributes(false, "interactedWith");
    setActiveNodeRot([0, 0, 0]);

    await sleep(1750);
    setActiveNodeAttributes(false, "exploding");

    await sleep(350);
    setActiveNodeAttributes(true, "visible");
  };

  const animateShrinkAndRip = async (siteRotY: number) => {
    const fstCoordSet = calculateCoordsBasedOnRotation(0.9, 0.3, siteRotY);
    const sndCoordSet = calculateCoordsBasedOnRotation(0.5, 0.2, siteRotY);
    const thirdCoordSet = calculateCoordsBasedOnRotation(0, 0.2, siteRotY);

    setActiveNodeAttributes(true, "interactedWith");

    setActiveNodePos([fstCoordSet.x, 0, fstCoordSet.z]);

    await sleep(800);
    setActiveNodePos([sndCoordSet.x, 0, sndCoordSet.z]);

    await sleep(2000);
    setActiveNodePos([thirdCoordSet.x, -0.4, thirdCoordSet.z]);

    await sleep(200);
    setActiveNodeAttributes(true, "shrinking");

    await sleep(200);
    setActiveNodePos([thirdCoordSet.x, -1.5, thirdCoordSet.z]);

    await sleep(300);
    setActiveNodeAttributes(false, "visible");

    await sleep(2900);
    setActiveNodeAttributes(false, "interactedWith");
    setActiveNodeAttributes(false, "shrinking");
    setActiveNodeRot([0, 0, 0]);

    await sleep(1100);
    setActiveNodeAttributes(true, "visible");
  };

  const updateActiveNode = async (node: NodeDataType) => {
    setActiveNode(node);
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
          action: () => updateActiveNode(eventState.node),
          delay: 3900,
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

  const { action, delay } = { ...dispatchAction(eventState) };

  (async () => {
    if (delay) await sleep(delay);
    if (action) action();
  })();
};

export default nodeManager;
