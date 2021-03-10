const getKeyPress = (key: string) => {
  if (["X", "Z", "D", "E", "V"].includes(key)) key = key.toLowerCase();

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
  return keyCodeAssocs[key as keyof typeof keyCodeAssocs];
};

export default getKeyPress;
