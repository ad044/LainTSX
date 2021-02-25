import * as eventTemplates from "../../core/eventTemplates";
import { getEndSceneContext } from "../../store";
import handleEndSceneInput from "../../core/input-handlers/handleEndSceneInput";
import { EndComponent } from "../../types/types";

it("Checks whether or not the end scene input handler reacts appropriately for each input", () => {
  {
    // changing end active component
    const spy = jest.spyOn(eventTemplates, "changeEndComponent");
    const testContext = { ...getEndSceneContext(), selectionVisible: true };

    handleEndSceneInput(testContext, "DOWN");

    expect(spy).toHaveBeenCalled();
  }
  // selecting end component
  {
    const spy = jest.spyOn(eventTemplates, "endGame");
    const testContext = { ...getEndSceneContext(), selectionVisible: true };

    handleEndSceneInput(testContext, "CIRCLE");

    expect(spy).toHaveBeenCalled();
  }

  {
    const spy = jest.spyOn(eventTemplates, "changeSite");
    const testContext = {
      ...getEndSceneContext(),
      selectionVisible: true,
      activeEndComponent: "continue" as EndComponent,
    };

    handleEndSceneInput(testContext, "CIRCLE");

    expect(spy).toHaveBeenCalled();
  }
});
