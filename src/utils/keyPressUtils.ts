export const getKeyCodeAssociation = (keyCode: number) => {
  const keyCodeAssocs = {
    40: "DOWN", // down arrow
    37: "LEFT", // left arrow
    38: "UP", // up arrow
    39: "RIGHT", // right arrow
    88: "CIRCLE", // x key
    90: "X", // z key
    68: "TRIANGLE", // d key
    69: "L2", // e key
    86: "START", // v key
    32: "SPACE",
  };
  return keyCodeAssocs[keyCode as keyof typeof keyCodeAssocs];
};
