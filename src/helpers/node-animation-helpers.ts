import { useStore } from "../store";
import sleep from "../utils/sleep";

const calculateCoordsBasedOnRotation = (
  x: number,
  z: number,
  rotation: number
) => ({
  x: x * Math.cos(rotation) - z * Math.sin(rotation),
  z: x * Math.sin(rotation) + z * Math.cos(rotation),
});

// async calls in this file are executed inside IIAFE-s because defining them as async would
// throw a warning about an unhandled promise, and we dont care about that.
// async/awaits here are used simply to improve readability, nothing else.

const setActiveNodePos = useStore.getState().setNodePos;
const setActiveNodeRot = useStore.getState().setNodeRot;
const setActiveNodeAttributes = useStore.getState().setNodeAttributes;

export const nodeThrowAnimation = () => {
  (async () => {
    const siteRotY = useStore.getState().siteRot[1];

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
  })();
};

export const nodeKnockAnimation = () => {
  const siteRotY = useStore.getState().siteRot[1];

  const fstCoordSet = calculateCoordsBasedOnRotation(1.1, 0.2, siteRotY);

  setActiveNodeAttributes(true, "interactedWith");

  setActiveNodePos([fstCoordSet.x, -0.6, fstCoordSet.z]);

  setTimeout(() => setActiveNodeAttributes(false, "interactedWith"), 2500);
};

export const nodeKnockAndFallAnimation = () => {
  (async () => {
    const siteRotY = useStore.getState().siteRot[1];

    const fstCoordSet = calculateCoordsBasedOnRotation(1.1, 0.2, siteRotY);

    setActiveNodeAttributes(true, "interactedWith");

    setActiveNodePos([fstCoordSet.x, -0.6, fstCoordSet.z]);

    await sleep(2300);
    setActiveNodeAttributes(false, "visible");

    await sleep(200);
    setActiveNodeAttributes(false, "interactedWith");

    await sleep(700);
    setActiveNodeAttributes(true, "visible");
  })();
};

export const nodeExplodeAnimation = () => {
  (async () => {
    const siteRotY = useStore.getState().siteRot[1];

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
  })();
};

export const nodeRipAnimation = () => {
  (async () => {
    const siteRotY = useStore.getState().siteRot[1];

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
  })();
};
