import { useStore } from "../store";

const getKeyPress = (key: string) => {
  const keybindings = useStore.getState().keybindings;

  // make the keybinds work with caps lock on aswell
  if (key.length === 1) key = key.toLowerCase();

  return Object.keys(keybindings).find((k) => keybindings[k] === key);
};

export default getKeyPress;
