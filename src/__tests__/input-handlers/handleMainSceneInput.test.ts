import { getMainSceneContext } from "../../store";
import handleMainSceneInput from "../../core/input-handlers/handleMainSceneInput";
import * as eventTemplates from "../../core/eventTemplates";
import site_a from "../../resources/site_a.json";
import {
  enterLevelSelection,
  pauseGame,
  ripNode,
  showAbout,
  throwNode,
} from "../../core/eventTemplates";
import { nodeToScene } from "../../helpers/node-helpers";
import { PauseComponent } from "../../types/types";

const expectOr = (...tests: (() => void)[]) => {
  try {
    tests.shift()!();
  } catch (e) {
    if (tests.length) expectOr(...tests);
    else throw e;
  }
};

it("Checks whether or not the main scene input handler reacts appropriately for each input", () => {
  {
    const spy = jest.spyOn(eventTemplates, "changeNode");
    const testContext = getMainSceneContext();
    handleMainSceneInput(testContext, "UP");
    expect(spy).toHaveBeenCalled();
  }
  {
    // move vertically when utmost up node is currently selected
    const spy = jest.spyOn(eventTemplates, "siteMoveVertical");
    const testContext = {
      ...getMainSceneContext(),
      activeNode: {
        ...site_a["04"]["0422"],
        matrixIndices: { matrixIdx: 7, rowIdx: 0, colIdx: 0 },
      },
    };
    handleMainSceneInput(testContext, "UP");
    expect(spy).toHaveBeenCalled();
  }
  {
    // move horizontally when utmost left node is currently selected
    const spy = jest.spyOn(eventTemplates, "siteMoveHorizontal");
    const testContext = getMainSceneContext();
    handleMainSceneInput(testContext, "LEFT");
    expect(spy).toHaveBeenCalled();
  }
  {
    // play throw node/rip node animation and set the scene when the player selects a node
    const testContext = getMainSceneContext();

    const output = handleMainSceneInput(testContext, "CIRCLE");
    expectOr(
      () =>
        expect(output).toEqual(
          ripNode({ currentScene: nodeToScene(testContext.activeNode)! })
        ),
      () =>
        expect(output).toEqual(
          throwNode({ currentScene: nodeToScene(testContext.activeNode)! })
        )
    );
  }
  {
    // entering level selection
    const testContext = getMainSceneContext();

    expect(handleMainSceneInput(testContext, "L2")).toEqual(
      enterLevelSelection({ selectedLevel: testContext.level })
    );
  }
  {
    // entering pause
    const testContext = getMainSceneContext();

    expect(handleMainSceneInput(testContext, "TRIANGLE")).toEqual(
      pauseGame({ siteRot: [Math.PI / 2, testContext.siteRotY, 0] })
    );
  }
  {
    // changing level inside level selection
    const spy = jest.spyOn(eventTemplates, "changeSelectedLevel");

    const testContext = {
      ...getMainSceneContext(),
      subscene: "level_selection",
    };

    handleMainSceneInput(testContext, "UP");

    expect(spy).toHaveBeenCalled();
  }
  {
    // selecting new level when currently below it

    const spy = jest.spyOn(eventTemplates, "selectLevel");
    const testContext = {
      ...getMainSceneContext(),
      selectedLevel: 10,
      subscene: "level_selection",
    };

    handleMainSceneInput(testContext, "CIRCLE");
    expect(spy).toHaveBeenCalled();
  }
  {
    // changing pause active component
    const spy = jest.spyOn(eventTemplates, "changePauseComponent");
    const testContext = {
      ...getMainSceneContext(),
      subscene: "pause",
    };

    handleMainSceneInput(testContext, "UP");

    expect(spy).toHaveBeenCalled();
  }
  {
    // selecting pause component
    const testContext = {
      ...getMainSceneContext(),
      subscene: "pause",
      activePauseComponent: "about" as PauseComponent,
    };

    expect(handleMainSceneInput(testContext, "CIRCLE")).toEqual(showAbout);
  }
});
