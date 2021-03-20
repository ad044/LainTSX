const getKeyPress = (key: string) => {
  // make the keybinds work with caps lock on aswell
  if (["X", "Z", "D", "E", "V", "T", "W", "R", "S", "C"].includes(key))
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
    t: "R2",
    e: "L2",
    w: "L1",
    r: "R1",
    v: "START",
    c: "SELECT",
  };
  return keyCodeAssocs[key as keyof typeof keyCodeAssocs];
};

export default getKeyPress;
