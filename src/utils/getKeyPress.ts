const getKeyPress = (key: string) => {
  if (["X", "Z", "D", "E", "V", "T", "W", "R"].includes(key))
    key = key.toLowerCase();

  const keyCodeAssocs = {
    ArrowDown: "DOWN",
    ArrowLeft: "LEFT",
    ArrowUp: "UP",
    ArrowRight: "RIGHT",
    x: "CIRCLE",
    z: "CROSS",
    d: "TRIANGLE",
    s: "SQUARE",
    e: "L2",
    v: "START",
    w: "L1",
    r: "R1",
  };
  return keyCodeAssocs[key as keyof typeof keyCodeAssocs];
};

export default getKeyPress;
