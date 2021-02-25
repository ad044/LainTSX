import * as eventTemplates from "../../core/eventTemplates";
import { getSsknSceneContext } from "../../store";
import handleSsknSceneInput from "../../core/input-handlers/handleSsknSceneInput";
import { exitSskn } from "../../core/eventTemplates";
import { SsknComponent } from "../../types/types";

it("Checks whether or not the sskn scene input handler reacts appropriately for each input", () => {
  {
    // changing sskn active component
    const spy = jest.spyOn(eventTemplates, "changeSsknComponent");
    const testContext = getSsknSceneContext();

    handleSsknSceneInput(testContext, "DOWN");

    expect(spy).toHaveBeenCalled();
  }
  {
    // select ok
    const spy = jest.spyOn(eventTemplates, "upgradeSskn");
    const testContext = getSsknSceneContext();

    handleSsknSceneInput(testContext, "CIRCLE");
    expect(spy).toHaveBeenCalled();
  }
  {
    // select cancel
    const testContext = {
      ...getSsknSceneContext(),
      activeSsknComponent: "cancel" as SsknComponent,
    };

    expect(handleSsknSceneInput(testContext, "CIRCLE")).toEqual(exitSskn);
  }
});
