const getKeyPress = (keyCode: string) => {
  const keyCodeAssocs = {
    ArrowDown: "DOWN", // down arrow
    ArrowLeft: "LEFT", // left arrow
    ArrowUp: "UP", // up arrow
    ArrowRight: "RIGHT", // right arrow
    x: "CIRCLE", // x key
    z: "CROSS", // z key
    d: "TRIANGLE", // d key
    e: "L2", // e key
    v: "START", // v key
  };
  return keyCodeAssocs[keyCode as keyof typeof keyCodeAssocs];
};

export default getKeyPress;
