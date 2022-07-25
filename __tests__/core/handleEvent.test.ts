import { enterSsknScene } from "@/core/events";
import handleEvent from "@/core/handleEvent";
import { useStore } from "@/store";
import { GameScene } from "@/types";

it("Checks whether handleEvent applies mutations correctly", () => {
  const initialState = useStore.getState();
  handleEvent(enterSsknScene);
  const newState = useStore.getState();
  expect(newState.scene).toEqual(GameScene.Sskn);
  expect(newState.prev.scene).toEqual(initialState.scene);
});
