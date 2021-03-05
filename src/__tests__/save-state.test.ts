import { getCurrentUserState } from "../store";

it("Checks if setting state on localStorage works", () => {
  const spy = jest.spyOn(Storage.prototype, "setItem");
  const saveState = JSON.stringify(getCurrentUserState());
  localStorage.setItem("lainSaveState", saveState);
  expect(spy).toHaveBeenCalledTimes(1);
  expect(localStorage.getItem("lainSaveState")).toEqual(saveState);
});
