import * as eventTemplates from "../../core/eventTemplates";
import { exitMedia } from "../../core/eventTemplates";
import { getMediaSceneContext } from "../../store";
import handleMediaSceneInput from "../../core/input-handlers/handleMediaSceneInput";
import { LeftMediaComponent, MediaSide } from "../../types/types";

it("Checks whether or not the media scene input handler reacts appropriately for each input", () => {
  {
    // changing left side media active component
    const spy = jest.spyOn(eventTemplates, "changeLeftMediaComponent");
    const testContext = getMediaSceneContext();

    handleMediaSceneInput(testContext, "DOWN");

    expect(spy).toHaveBeenCalled();
  }
  {
    // changing media side from left to right
    const spy = jest.spyOn(eventTemplates, "changeMediaSide");
    const testContext = getMediaSceneContext();

    handleMediaSceneInput(testContext, "RIGHT");

    expect(spy).toHaveBeenCalled();
  }
  {
    // exit media
    const testContext = {
      ...getMediaSceneContext(),
      activeMediaComponent: "exit" as LeftMediaComponent,
    };

    expect(handleMediaSceneInput(testContext, "CIRCLE")).toEqual(exitMedia);
  }

  {
    // play media
    const spy = jest.spyOn(eventTemplates, "playMedia");
    const testContext = getMediaSceneContext();
    handleMediaSceneInput(testContext, "CIRCLE");

    expect(spy).toHaveBeenCalled();
  }
  {
    // change right side media component
    const spy = jest.spyOn(eventTemplates, "changeRightMediaComponent");
    const testContext = {
      ...getMediaSceneContext(),
      currentMediaSide: "right" as MediaSide,
    };

    handleMediaSceneInput(testContext, "DOWN");

    expect(spy).toHaveBeenCalled();
  }
  {
    // change from right side to left
    const spy = jest.spyOn(eventTemplates, "changeMediaSide");
    const testContext = {
      ...getMediaSceneContext(),
      currentMediaSide: "right" as MediaSide,
    };

    handleMediaSceneInput(testContext, "LEFT");

    expect(spy).toHaveBeenCalled();
  }
});
