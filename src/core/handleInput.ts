import {
  BootSubscene,
  Direction,
  EndComponent,
  GameEvent,
  GameScene,
  Key,
  LainAnimation,
  MainMenuComponent,
  MainSubscene,
  MediaComponent,
  MediaSide,
  PauseComponent,
  PromptComponent,
  SsknComponent,
  State,
} from "@/types";
import {
  changeMediaSideToLeft,
  exitIdleScene,
  exitToMain,
  navigateSiteHorizontal,
  navigateSiteVertical,
  playMedia,
} from "./events";
import {
  changeEndComponent,
  changeLeftMediaComponent,
  changeMainMenuComponent,
  changeMediaSideToRight,
  changePauseComponent,
  changePromptComponent,
  changeRightMediaComponent,
  changeSelectedLevel,
  changeSite,
  changeSsknComponent,
  displayPrompt,
  endGame,
  enterLevelSelection,
  enterLoadData,
  enterUserAuthorization,
  exitAbout,
  exitLevelSelection,
  exitLoadData,
  exitMedia,
  exitPause,
  exitPrompt,
  exitSskn,
  exitUserAuthorization,
  hideWordNotFound,
  tryLoadGame,
  pauseGame,
  removePlayerNameLastChar,
  resetCameraTilt,
  resetInputCooldown,
  rotateSiteHorizontal,
  saveGame,
  selectLevel,
  selectNode,
  selectWord,
  invertCameraTilt,
  showAbout,
  showPermissionDenied,
  tryStartNewGame,
  toggleProtocolLines,
  updateLetterMatrixIndex,
  updatePlayerName,
  upgradeSskn,
} from "./events";

const handleMainScenePromptInput = (
  state: State,
  keyPress: Key
): GameEvent | null => {
  switch (keyPress) {
    case Key.Left:
      return changePromptComponent(Direction.Left);
    case Key.Right:
      return changePromptComponent(Direction.Right);
    case Key.Circle:
      switch (state.promptComponent) {
        case PromptComponent.No:
          return exitPrompt;
        case PromptComponent.Yes:
          switch (state.pauseComponent) {
            case PauseComponent.Change:
              return changeSite(state);
            case PauseComponent.Save:
              return saveGame(state);
            case PauseComponent.Load: {
              return tryLoadGame();
            }
          }
      }
  }
  return null;
};

const handleSiteInput = (state: State, keyPress: Key): GameEvent | null => {
  switch (keyPress) {
    case Key.Left:
      return navigateSiteHorizontal(state, Direction.Left);
    case Key.Right:
      return navigateSiteHorizontal(state, Direction.Right);
    case Key.Up:
      return navigateSiteVertical(state, Direction.Up);
    case Key.Down:
      return navigateSiteVertical(state, Direction.Down);
    case Key.Circle:
      return selectNode(state);
    case Key.L2:
      return enterLevelSelection(state);
    case Key.Triangle:
    case Key.Select:
      if (state.lainAnimation !== LainAnimation.Standing) {
        return resetInputCooldown;
      }
      return pauseGame;
    case Key.L1:
      return rotateSiteHorizontal(state, Direction.Left);
    case Key.R1:
      return rotateSiteHorizontal(state, Direction.Right);
    case Key.Square:
      return toggleProtocolLines(state);
    case Key.R2:
      if (state.cameraTiltValue === 0) {
        return invertCameraTilt(state);
      } else {
        return resetCameraTilt(state);
      }
  }

  return null;
};

const handleLevelSelectionInput = (
  state: State,
  keyPress: Key
): GameEvent | null => {
  switch (keyPress) {
    case Key.Up:
      return changeSelectedLevel(state, Direction.Up);
    case Key.Down:
      return changeSelectedLevel(state, Direction.Down);
    case Key.Cross:
      return exitLevelSelection;
    case Key.Circle:
      return selectLevel(state);
  }

  return null;
};

const handlePauseInput = (state: State, keyPress: Key): GameEvent | null => {
  if (state.showingAbout) return exitAbout;
  switch (keyPress) {
    case Key.Up:
      return changePauseComponent(state, Direction.Up);
    case Key.Down:
      return changePauseComponent(state, Direction.Down);
    case Key.Circle:
      switch (state.pauseComponent) {
        case PauseComponent.About:
          return showAbout;
        case PauseComponent.Exit:
          return exitPause;
        case PauseComponent.Load:
        case PauseComponent.Save:
          return displayPrompt;
        case PauseComponent.Change:
          if (state.gameProgress.gate_level < 4) {
            return showPermissionDenied;
          } else {
            return displayPrompt;
          }
      }
  }

  return null;
};

const handleSsknSceneInput = (
  state: State,
  keyPress: Key
): GameEvent | null => {
  switch (keyPress) {
    case Key.Up:
      return changeSsknComponent(Direction.Up);
    case Key.Down:
      return changeSsknComponent(Direction.Down);
    case Key.Circle:
      switch (state.ssknComponent) {
        case SsknComponent.Ok:
          return upgradeSskn(state);
        case SsknComponent.Cancel:
          return exitSskn;
      }
  }

  return null;
};

const handleMediaSceneInput = (
  state: State,
  keyPress: Key
): GameEvent | null => {
  switch (state.mediaSide) {
    case MediaSide.Left:
      switch (keyPress) {
        case Key.Up:
          return changeLeftMediaComponent(Direction.Up);
        case Key.Down:
          return changeLeftMediaComponent(Direction.Down);
        case Key.Right: {
          return changeMediaSideToRight(state);
        }
        case Key.Circle:
          switch (state.mediaComponent) {
            case MediaComponent.Play:
              return playMedia(state);
            case MediaComponent.Exit:
              return exitMedia;
          }
      }
      break;
    case MediaSide.Right:
      switch (keyPress) {
        case Key.Up:
          return changeRightMediaComponent(state, Direction.Up);
        case Key.Down:
          return changeRightMediaComponent(state, Direction.Down);
        case Key.Left:
          return changeMediaSideToLeft(state);
        case Key.Circle:
          return selectWord(state);
      }
  }
  return null;
};

const handleEndSceneInput = (state: State, keyPress: Key): GameEvent | null => {
  switch (keyPress) {
    case Key.Up:
      return changeEndComponent(Direction.Up);
    case Key.Down:
      return changeEndComponent(Direction.Down);
    case Key.Circle:
      switch (state.endComponent) {
        case EndComponent.End:
          return endGame(state);
        case EndComponent.Continue:
          return changeSite(state);
      }
  }
  return null;
};

const handleBootScenePromptInput = (
  state: State,
  keyPress: Key
): GameEvent | null => {
  switch (keyPress) {
    case Key.Left:
      return changePromptComponent(Direction.Left);
    case Key.Right:
      return changePromptComponent(Direction.Right);
    case Key.Circle:
      switch (state.promptComponent) {
        case PromptComponent.No:
          return exitLoadData;
        case PromptComponent.Yes:
          return tryLoadGame();
      }
  }

  return null;
};

const handleMainMenuInput = (state: State, keyPress: Key): GameEvent | null => {
  switch (keyPress) {
    case Key.Up:
      return changeMainMenuComponent(Direction.Up);
    case Key.Down:
      return changeMainMenuComponent(Direction.Down);
    case Key.Circle:
      switch (state.mainMenuComponent) {
        case MainMenuComponent.AuthorizeUser:
          return enterUserAuthorization;
        case MainMenuComponent.LoadData:
          return enterLoadData;
      }
  }

  return null;
};

const handleAuthorizeUserInput = (
  state: State,
  keyPress: Key
): GameEvent | null => {
  switch (keyPress) {
    case Key.Start:
      return tryStartNewGame(state);
    case Key.Cross:
      if (state.playerName.length > 0) {
        return removePlayerNameLastChar(state);
      } else {
        return exitUserAuthorization;
      }
    case Key.Up:
      return updateLetterMatrixIndex(state, Direction.Up);
    case Key.Down:
      return updateLetterMatrixIndex(state, Direction.Down);
    case Key.Left:
      return updateLetterMatrixIndex(state, Direction.Left);
    case Key.Right:
      return updateLetterMatrixIndex(state, Direction.Right);
    case Key.Circle:
      return updatePlayerName(state);
  }

  return null;
};

const handleInput = (state: State, keyPress: Key): GameEvent | null => {
  switch (state.scene) {
    case GameScene.Main: {
      if (state.promptVisible) {
        return handleMainScenePromptInput(state, keyPress);
      }

      switch (state.mainSubscene) {
        case MainSubscene.Site:
          if (state.wordNotFound) return hideWordNotFound;
          return handleSiteInput(state, keyPress);
        case MainSubscene.LevelSelection:
          return handleLevelSelectionInput(state, keyPress);
        case MainSubscene.Pause:
          return handlePauseInput(state, keyPress);
        default:
          return null;
      }
    }
    case GameScene.Boot: {
      if (state.promptVisible) {
        return handleBootScenePromptInput(state, keyPress);
      }

      switch (state.bootSubscene) {
        case BootSubscene.MainMenu: {
          return handleMainMenuInput(state, keyPress);
        }
        case BootSubscene.AuthorizeUser: {
          return handleAuthorizeUserInput(state, keyPress);
        }
        default:
          return null;
      }
    }
    case GameScene.Media: {
      return handleMediaSceneInput(state, keyPress);
    }
    case GameScene.Sskn: {
      return handleSsknSceneInput(state, keyPress);
    }
    case GameScene.End: {
      if (state.endSceneSelectionVisible) {
        return handleEndSceneInput(state, keyPress);
      }
    }
    case GameScene.Idle: {
      return exitIdleScene;
    }
    case GameScene.Polytan:
    case GameScene.Gate: {
      return exitToMain;
    }
  }

  return null;
};

export default handleInput;
