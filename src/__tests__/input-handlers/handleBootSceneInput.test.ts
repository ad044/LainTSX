import * as eventTemplates from "../../core/eventTemplates";
import { getBootSceneContext } from "../../store";
import handleBootSceneInput from "../../core/input-handlers/handleBootSceneInput";
import {
  enterLoadData,
  enterUserAuthorization,
  exitUserAuthorization,
  startNewGame,
} from "../../core/eventTemplates";
import {
  BootSceneContext,
  BootSubscene,
  MainMenuComponent,
} from "../../types/types";

it("Checks whether or not the boot scene input handler reacts appropriately for each input", () => {
  {
    // change main menu active component
    const spy = jest.spyOn(eventTemplates, "changeMainMenuComponent");
    const testContext = getBootSceneContext();
    handleBootSceneInput(testContext, "UP");
    expect(spy).toHaveBeenCalled();
  }
  // select main menu component
  {
    const testContext = {
      ...getBootSceneContext(),
      activeMainMenuComponent: "authorize_user" as MainMenuComponent,
    };
    expect(handleBootSceneInput(testContext, "CIRCLE")).toEqual(
      enterUserAuthorization
    );
  }
  {
    const testContext = {
      ...getBootSceneContext(),
      activeMainMenuComponent: "load_data" as MainMenuComponent,
    };
    expect(handleBootSceneInput(testContext, "CIRCLE")).toEqual(enterLoadData);
  }
  {
    // change letter in authorize user scene
    const spy = jest.spyOn(eventTemplates, "updateAuthorizeUserLetterIdx");
    const testContext = {
      ...getBootSceneContext(),
      subscene: "authorize_user" as BootSubscene,
    };

    handleBootSceneInput(testContext, "RIGHT");

    expect(spy).toHaveBeenCalled();
  }
  {
    // start new game
    const testContext = {
      ...getBootSceneContext(),
      subscene: "authorize_user" as BootSubscene,
      playerName: "チ",
    };

    expect(handleBootSceneInput(testContext, "START")).toEqual(startNewGame);
  }
  {
    // delete last char if player name is not empty
    const spy = jest.spyOn(eventTemplates, "removePlayerNameLastChar");
    const testContext = {
      ...getBootSceneContext(),
      subscene: "authorize_user" as BootSubscene,
      playerName: "チ",
    };

    handleBootSceneInput(testContext, "X");

    expect(spy).toHaveBeenCalled();
  }
  {
    // go back to main menu if player name is empty
    const testContext = {
      ...getBootSceneContext(),
      subscene: "authorize_user" as BootSubscene,
      playerName: "",
    };

    expect(handleBootSceneInput(testContext, "X")).toEqual(
      exitUserAuthorization
    );
  }
});
