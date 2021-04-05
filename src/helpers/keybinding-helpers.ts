export const formatKey = (key: string) => {
  switch (key) {
    case "DOWN":
      return "↓";
    case "LEFT":
      return "←";
    case "UP":
      return "↑";
    case "RIGHT":
      return "→";
    case "CIRCLE":
      return "◯";
    case "CROSS":
      return "✖";
    case "SQUARE":
      return "◼";
    case "TRIANGLE":
      return "▲";
    default:
      return key;
  }
};
