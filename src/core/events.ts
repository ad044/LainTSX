import initialProgressJson from "@/json/initial_progress.json";
import {
  GameSite,
  BootSubscene,
  Direction,
  EndComponent,
  GameEvent,
  GameScene,
  MainMenuComponent,
  MainSubscene,
  MediaComponent,
  MediaSide,
  NodeData,
  MatrixIndex2D,
  PauseComponent,
  PromptComponent,
  SsknComponent,
  State,
  LainAnimation,
  Key,
  GameProgress,
  SaveStatus,
  IdleSceneData,
  SaveState,
} from "@/types";
import { addCharacter, getCharacter, moveCursor } from "@/utils/boot";
import { getAnimationForDirection } from "@/utils/lain";
import { playMediaElement, resetMediaElement } from "@/utils/media";
import { randomFrom } from "@/utils/random";
import { getLayout, getLevelLimit } from "@/utils/site";
import { AudioAnalyser } from "three";

import {
  filterInvisibleNodes,
  findNode,
  findNodeAtLevel,
  findNodeFromWord,
  findSegmentForNodeAtCol,
  getNode,
  getPolytanPart,
  getRowForPosition,
  isAudioOnly,
  isNodeVisible,
  moveHorizontalAndFindNode,
} from "@/utils/node";
import { WORD_STATES } from "@/components/canvas/objects/MediaScene/RightSide";
import { saveUserProgress } from "@/utils/save";
import { logError } from "@/utils/log";

export const resetGameState: GameEvent = {
  state: [
    {
      mutation: {
        siteSaveState: {
          [GameSite.A]: {
            node: getNode("0414a"),
            siteSegment: 6,
            nodeMatrixIndex: { row: 1, col: 0 },
            level: 4,
          },
          [GameSite.B]: {
            node: getNode("0105b"),
            siteSegment: 6,
            nodeMatrixIndex: { row: 2, col: 0 },
            level: 1,
          },
        },
        node: getNode("0414a"),
        nodeMatrixIndex: { row: 1, col: 0 },
        siteSegment: 6,
        level: 4,
        site: GameSite.A,
        gameProgress: initialProgressJson,
      },
    },
  ],
};

export const resetMediaScene: GameEvent = {
  state: [
    {
      mutation: {
        mediaComponent: MediaComponent.Play,
        mediaSide: MediaSide.Left,
        wordStateIdx: 0,
        lastMediaComponents: {
          left: MediaComponent.Play,
          right: MediaComponent.FirstWord,
        },
      },
    },
  ],
};

export const setPercentageElapsed = (to: number) => {
  return {
    state: [{ mutation: { mediaPercentageElapsed: to } }],
  };
};

export const setWordSelected = (to: boolean) => {
  return {
    state: [{ mutation: { wordSelected: to } }],
  };
};

const changeNode = (
  newNode: State["node"],
  nodeMatrixIndex: MatrixIndex2D
): GameEvent => ({
  state: [
    {
      mutation: {
        node: newNode,
        nodeMatrixIndex: nodeMatrixIndex,
        inputCooldown: 1500,
      },
    },
  ],
  audio: [{ sfx: ["snd_0.mp4"] }],
});

export const navigateSiteHorizontal = (
  state: State,
  direction: Direction.Left | Direction.Right
): GameEvent => {
  const navigationResult = findNode(state, direction, true);

  if (!navigationResult) {
    return resetInputCooldown;
  }

  const { node, nodeMatrixIndex, didMove, siteSegment } = navigationResult;

  if (didMove) {
    if (state.lainAnimation !== LainAnimation.Standing) {
      return resetInputCooldown;
    }

    return {
      state: [
        {
          mutation: {
            lainAnimation: getAnimationForDirection(direction),
            siteSegment: siteSegment,
            cameraTiltValue: 0,
            inputCooldown: 5500,
          },
        },
        {
          mutation: {
            node: node,
            lainAnimation: LainAnimation.Standing,
            nodeMatrixIndex: nodeMatrixIndex,
          },
          delay: 3900,
        },
      ],
      audio: [{ sfx: ["snd_6.mp4"] }, { sfx: ["snd_34.mp4"], delay: 1100 }],
    };
  } else {
    return changeNode(node, nodeMatrixIndex);
  }
};

export const navigateSiteVertical = (
  state: State,
  direction: Direction.Up | Direction.Down
): GameEvent => {
  const navigationResult = findNode(state, direction, true);

  if (!navigationResult) {
    return resetInputCooldown;
  }

  const { node, nodeMatrixIndex, didMove, level } = navigationResult;

  if (didMove) {
    if (state.lainAnimation !== LainAnimation.Standing) {
      return resetInputCooldown;
    }

    return {
      state: [
        {
          mutation: {
            lainAnimation: getAnimationForDirection(direction),
            cameraTiltValue: 0,
            level: level,
            inputCooldown: 5500,
          },
        },
        {
          mutation: {
            lainAnimation: LainAnimation.Standing,
            node: node,
            nodeMatrixIndex: nodeMatrixIndex,
          },
          delay: 3900,
        },
      ],
      audio: [
        { sfx: ["snd_13.mp4"] },
        { sfx: ["snd_10.mp4", "snd_9.mp4"], delay: 1300 },
        { sfx: ["snd_8.mp4"], delay: 2700 },
      ],
    };
  } else {
    return changeNode(node, nodeMatrixIndex);
  }
};

const nodeToSceneEvent = (state: State, node: NodeData): GameEvent | null => {
  switch (node.type) {
    case 0:
    case 2:
    case 4:
    case 3:
    case 5:
      return enterMediaScene;
    case 6:
      return enterTakScene(state);
    case 7:
      return enterSsknScene;
    case 8:
      return enterGateScene(state);
    case 9:
      return enterPolytanScene(state);
    default:
      return null;
  }
};

export const selectNode = (state: State): GameEvent => {
  const { node: node, gameProgress } = state;

  if (state.lainAnimation !== LainAnimation.Standing) return resetInputCooldown;

  if (node === null || !isNodeVisible(node, gameProgress))
    return resetInputCooldown;

  if (
    node.upgrade_requirement > gameProgress.sskn_level ||
    node.required_final_video_viewcount > gameProgress.final_video_viewcount
  ) {
    return randomFrom([knockNodeAndFall, knockNode, explodeNode]);
  }

  const setSceneEvent = nodeToSceneEvent(state, node);

  if (!setSceneEvent) {
    logError(
      state,
      `error: couldn't find scene setter for node, id: ${node.id}`
    );
    return resetInputCooldown;
  }

  const nodeSelectAnimation = Math.random() < 0.4 ? throwNode : ripNode;

  return nodeSelectAnimation(setSceneEvent);
};

export const exitIdleScene: GameEvent = {
  state: [
    {
      mutation: {
        scene: GameScene.Main,
        idleStarting: false,
        intro: false,
        inputCooldown: -1,
      },
    },
  ],
};

export const enterMediaScene: GameEvent = {
  state: [
    {
      mutation: {
        scene: GameScene.Media,
      },
    },
  ],
};

export const enterTakScene = (state: State): GameEvent => {
  if (!state.node) {
    logError(state, "error: node was null while trying to enter tak scene");
    return resetInputCooldown;
  }

  return {
    state: [
      {
        mutation: { scene: GameScene.Tak },
      },
    ],
    additionalEvents: [
      {
        event: setNodeViewed(state.gameProgress, state.node),
      },
    ],
  };
};

export const enterSsknScene: GameEvent = {
  state: [{ mutation: { scene: GameScene.Sskn } }],
};

export const enterPolytanScene = (state: State): GameEvent => {
  if (!state.node) {
    logError(state, "error: node was null while trying to enter polytan");
    return resetInputCooldown;
  }

  const part = getPolytanPart(state.node);
  if (!part) {
    logError(
      state.node,
      `error: incorrect node passed to polytan part mapper, id: ${state.node.id}`
    );
    return resetInputCooldown;
  }

  const newProgress = {
    ...state.gameProgress,
    polytan_unlocked_parts: {
      ...state.gameProgress.polytan_unlocked_parts,
      [part]: true,
    },
  };

  return {
    state: [
      {
        mutation: {
          scene: GameScene.Polytan,
          gameProgress: newProgress,
        },
      },
    ],
    additionalEvents: [
      {
        event: setNodeViewed(newProgress, state.node),
      },
    ],
  };
};

export const enterGateScene = (state: State): GameEvent => {
  if (!state.node) {
    logError(state, "error: node was null while trying to enter gate scene");
    return resetInputCooldown;
  }

  const newProgress = {
    ...state.gameProgress,
    gate_level: state.gameProgress.gate_level + 1,
  };

  return {
    state: [
      {
        mutation: {
          scene: GameScene.Gate,
          gameProgress: newProgress,
        },
      },
    ],
    additionalEvents: [
      {
        event: setNodeViewed(newProgress, state.node),
      },
    ],
  };
};

export const setKeybindings = (to: Record<string, Key>): GameEvent => {
  return {
    state: [{ mutation: { keybindings: to } }],
  };
};

export const setLanguage = (to: string) => {
  return {
    state: [{ mutation: { language: to } }],
  };
};

export const throwNode = (setSceneEvent: GameEvent): GameEvent => ({
  state: [
    {
      mutation: {
        lainAnimation: LainAnimation.ThrowNode,
        inputCooldown: -1,
        cameraTiltValue: 0,
      },
    },
    {
      mutation: {
        intro: false,
        lainAnimation: LainAnimation.Standing,
      },
      delay: 3450,
    },
  ],
  audio: [
    { sfx: ["snd_0.mp4"] },
    { sfx: ["snd_12.mp4"], delay: 1600 },
    { sfx: ["snd_13.mp4", "snd_14.mp4"], delay: 2800 },
  ],
  additionalEvents: [{ event: setSceneEvent, delay: 3450 }],
});

export const ripNode = (setSceneEvent: GameEvent): GameEvent => ({
  state: [
    {
      mutation: {
        lainAnimation: LainAnimation.RipNode,
        inputCooldown: -1,
        cameraTiltValue: 0,
      },
    },
    {
      mutation: {
        intro: false,
        lainAnimation: LainAnimation.Standing,
      },
      delay: 6000,
    },
  ],
  audio: [
    { sfx: ["snd_0.mp4"] },
    { sfx: ["snd_12.mp4"], delay: 1600 },
    { sfx: ["snd_13.mp4", "snd_15.mp4"], delay: 4000 },
  ],
  additionalEvents: [{ event: setSceneEvent, delay: 6000 }],
});

export const explodeNode = {
  state: [
    {
      mutation: {
        lainAnimation: LainAnimation.TouchNodeAndGetScared,
        inputCooldown: 3800,
        cameraTiltValue: 0,
      },
    },
    {
      mutation: {
        lainAnimation: LainAnimation.Standing,
      },
      delay: 3800,
    },
  ],
  audio: [
    { sfx: ["snd_0.mp4"] },
    { sfx: ["snd_17.mp4"], delay: 2400 },
    { sfx: ["snd_33.mp4"], delay: 3150 },
  ],
};

export const knockNode = {
  state: [
    {
      mutation: {
        lainAnimation: LainAnimation.Knock,
        cameraTiltValue: 0,
        inputCooldown: 3500,
      },
    },
    {
      mutation: { lainAnimation: LainAnimation.Standing },
      delay: 3500,
    },
  ],
  audio: [{ sfx: ["snd_0.mp4"] }, { sfx: ["snd_18.mp4"], delay: 1200 }],
};

export const knockNodeAndFall = {
  state: [
    {
      mutation: {
        lainAnimation: LainAnimation.KnockAndFall,
        cameraTiltValue: 0,
        inputCooldown: 6200,
      },
    },
    {
      mutation: {
        lainAnimation: LainAnimation.Standing,
      },
      delay: 6200,
    },
  ],
  audio: [
    { sfx: ["snd_0.mp4"] },
    { sfx: ["snd_18.mp4"], delay: 1200 },
    { sfx: ["snd_19.mp4"], delay: 2300 },
    { sfx: ["snd_33.mp4"], delay: 3150 },
  ],
};

export const enterLevelSelection = (state: State): GameEvent => ({
  state: [
    {
      mutation: {
        selectedLevel: state.level,
        cameraTiltValue: 0,
        mainSubscene: MainSubscene.LevelSelection,
        inputCooldown: 1500,
      },
    },
  ],
  audio: [{ sfx: ["snd_1.mp4"] }],
});

export const exitLevelSelection: GameEvent = {
  state: [
    { mutation: { mainSubscene: MainSubscene.Site, inputCooldown: 1500 } },
  ],
  audio: [{ sfx: ["snd_1.mp4"] }],
};

export const changeSelectedLevel = (
  state: State,
  direction: Direction.Up | Direction.Down
): GameEvent => {
  if (
    (direction === Direction.Up &&
      state.selectedLevel === getLevelLimit(state.site)) ||
    (direction === Direction.Down && state.selectedLevel === 1)
  ) {
    return resetInputCooldown;
  }

  return {
    state: [
      {
        mutation: {
          selectedLevel:
            direction === Direction.Up
              ? state.selectedLevel + 1
              : state.selectedLevel - 1,
          inputCooldown: 100,
        },
      },
    ],
  };
};

export const enterScene = (scene: GameScene): GameEvent => ({
  state: [
    {
      mutation: {
        scene: scene,
      },
    },
  ],
});

export const selectLevel = (state: State): GameEvent => {
  if (
    state.lainAnimation !== LainAnimation.Standing ||
    state.level === state.selectedLevel
  ) {
    return resetInputCooldown;
  }

  const direction =
    state.selectedLevel > state.level ? Direction.Up : Direction.Down;

  const navigationResult = findNodeAtLevel(state, state.selectedLevel);

  const { node, nodeMatrixIndex } = navigationResult;

  return {
    state: [
      {
        mutation: {
          lainAnimation: getAnimationForDirection(direction),
          level: state.selectedLevel,
          mainSubscene: MainSubscene.Site,
          inputCooldown: 5500,
        },
      },
      {
        mutation: {
          node: node,
          lainAnimation: LainAnimation.Standing,
          nodeMatrixIndex: nodeMatrixIndex,
        },
        delay: 3900,
      },
    ],
    audio: [
      { sfx: ["snd_10.mp4", "snd_9.mp4"], delay: 1300 },
      { sfx: ["snd_8.mp4"], delay: 2700 },
    ],
  };
};

export const pauseGame: GameEvent = {
  state: [
    {
      mutation: {
        lainAnimation: LainAnimation.RipMiddleRing,
        cameraTiltValue: 0,
        mainSubscene: MainSubscene.Pause,
        inputCooldown: -1,
      },
    },
  ],
  audio: [{ sfx: ["snd_7.mp4"] }, { sfx: ["snd_23.mp4"], delay: 3600 }],
};

export const rotateSiteHorizontal = (
  state: State,
  direction: Direction.Left | Direction.Right
): GameEvent => {
  const navigationResult = moveHorizontalAndFindNode(state, direction);

  if (!navigationResult || state.lainAnimation !== LainAnimation.Standing) {
    return resetInputCooldown;
  }

  const { node, nodeMatrixIndex, siteSegment } = navigationResult;

  return {
    state: [
      {
        mutation: {
          lainAnimation: getAnimationForDirection(direction),
          cameraTiltValue: 0,
          inputCooldown: 5500,
          siteSegment: siteSegment,
        },
      },
      {
        mutation: {
          lainAnimation: LainAnimation.Standing,
          node: node,
          nodeMatrixIndex: nodeMatrixIndex,
        },
        delay: 3900,
      },
    ],
    audio: [{ sfx: ["snd_6.mp4"] }, { sfx: ["snd_34.mp4"], delay: 1100 }],
  };
};

export const changePauseComponent = (
  state: State,
  direction: Direction.Up | Direction.Down
): GameEvent => {
  const components: PauseComponent[] = [
    PauseComponent.Load,
    PauseComponent.About,
    PauseComponent.Change,
    PauseComponent.Save,
    PauseComponent.Exit,
  ];

  if (state.pauseComponent === null) {
    logError(state, "error: pause component was null while trying to navigate");
    return {};
  }

  const currIndex = components.indexOf(state.pauseComponent);
  if (currIndex === -1) {
    logError(
      state,
      `error: couldn't find current pause component in array, current component: ${state.pauseComponent}`
    );
    return resetInputCooldown;
  }
  const newIndex = currIndex + (direction === Direction.Up ? -1 : 1);

  if (newIndex < 0 || newIndex > 4) {
    return {};
  }

  return {
    state: [
      {
        mutation: {
          pauseComponent: components[newIndex],
          inputCooldown: 700,
        },
      },
    ],
    audio: [{ sfx: ["snd_1.mp4"] }],
  };
};

export const showPermissionDenied = {
  state: [
    { mutation: { permissionDenied: true, inputCooldown: 1200 } },
    { mutation: { permissionDenied: false }, delay: 1200 },
  ],
  audio: [{ sfx: ["snd_0.mp4"] }],
};

export const displayPrompt = {
  state: [{ mutation: { promptVisible: true, inputCooldown: 0 } }],
  audio: [{ sfx: ["snd_0.mp4"] }],
};

export const showAbout = {
  state: [{ mutation: { showingAbout: true } }],
  audio: [{ sfx: ["snd_0.mp4"] }],
};

export const exitPause: GameEvent = {
  state: [
    {
      mutation: {
        inputCooldown: 1400,
        mainSubscene: MainSubscene.Site,
        pauseComponent: null,
      },
    },
    {
      mutation: {
        pauseComponent: PauseComponent.Change,
        inputCooldown: 0,
        lainAnimation: LainAnimation.Standing,
      },
      delay: 1200,
    },
  ],
  audio: [{ sfx: ["snd_0.mp4"] }],
};

export const exitAbout = {
  state: [{ mutation: { showingAbout: false, inputCooldown: 0 } }],
};

export const changePromptComponent = (
  direction: Direction.Right | Direction.Left
): GameEvent => ({
  state: [
    {
      mutation: {
        promptComponent:
          direction === Direction.Right
            ? PromptComponent.No
            : PromptComponent.Yes,
        inputCooldown: 100,
      },
    },
  ],
  audio: [{ sfx: ["snd_1.mp4"] }],
});

export const exitPrompt: GameEvent = {
  state: [
    {
      mutation: {
        promptComponent: PromptComponent.No,
        promptVisible: false,
        inputCooldown: 0,
      },
    },
  ],
  audio: [{ sfx: ["snd_28.mp4"] }],
};

export const saveGame = (state: State): GameEvent => ({
  state: [
    {
      mutation: { saveStatus: SaveStatus.SaveSuccessful, inputCooldown: 1200 },
    },
    {
      mutation: {
        saveStatus: SaveStatus.None,
        promptVisible: false,
        promptComponent: PromptComponent.No,
      },
      delay: 1200,
    },
  ],
  audio: [{ sfx: ["snd_28.mp4"] }],
  effects: [() => saveUserProgress(state)],
});

export const loadGameFail: GameEvent = {
  state: [
    { mutation: { saveStatus: SaveStatus.LoadFailure, inputCooldown: 1200 } },
    { mutation: { saveStatus: SaveStatus.None }, delay: 1200 },
  ],
  audio: [{ sfx: ["snd_28.mp4"] }],
};

export const tryLoadGame = (): GameEvent => {
  const newStateStr = localStorage.getItem("lainSaveStateV2");
  if (!newStateStr) {
    return loadGameFail;
  }

  const newState: SaveState = JSON.parse(newStateStr)

  return {
    state: [
      {
        mutation: {
          saveStatus: SaveStatus.LoadSuccessful,
          inputCooldown: 1200,
        },
      },
      {
        mutation: {
          ...newState,
          saveStatus: SaveStatus.None,
          scene: GameScene.None,
          mainSubscene: MainSubscene.Site,
          lainAnimation: LainAnimation.Standing,
          promptVisible: false,
          promptComponent: PromptComponent.No,
          pauseComponent: PauseComponent.Change,
          protocolLinesEnabled: false,
        },
        delay: 1200,
      },
      {
        mutation: { scene: GameScene.Main, intro: true },
        delay: 1300,
      },
    ],
    audio: [{ sfx: ["snd_28.mp4"] }],
    additionalEvents: [{ event: updateLayouts(newState.gameProgress) }],
  };
};

export const changeSite = (state: State): GameEvent => {
  const siteToLoad = state.site === GameSite.A ? GameSite.B : GameSite.A;
  const stateToLoad = state.siteSaveState[siteToLoad];

  const newSiteSaveState = {
    ...state.siteSaveState,
    [state.site]: {
      node: state.node,
      siteSegment: state.siteSegment,
      nodeMatrixIndex: state.nodeMatrixIndex,
    },
  };

  return {
    state: [
      {
        mutation: {
          intro: true,
          scene: GameScene.ChangeDisc,
          lainAnimation: LainAnimation.Standing,
          promptVisible: false,
          promptComponent: PromptComponent.No,
          mainSubscene: MainSubscene.Site,
          protocolLinesEnabled: false,
          inputCooldown: -1,
          site: siteToLoad,
          // load state
          siteSegment: stateToLoad.siteSegment,
          nodeMatrixIndex: stateToLoad.nodeMatrixIndex,
          node: stateToLoad.node,
          level: stateToLoad.level,
          // save state
          siteSaveState: newSiteSaveState,
        },
      },
    ],
  };
};

export const setEndSelectionVisible = (to: boolean) => {
  return {
    state: [
      {
        mutation: {
          endSceneSelectionVisible: to,
        },
      },
    ],
  };
};

export const changeLeftMediaComponent = (
  direction: Direction.Up | Direction.Down
): GameEvent => ({
  state: [
    {
      mutation: {
        mediaComponent:
          direction === Direction.Up
            ? MediaComponent.Play
            : MediaComponent.Exit,
        inputCooldown: 1200,
      },
    },
  ],
  audio: [{ sfx: ["snd_1.mp4"] }],
});

export const changeMediaSideToRight = (state: State): GameEvent => {
  if (!state.node) {
    logError(
      state,
      "error: node was null while trying to change media side to right"
    );
    return resetInputCooldown;
  }

  if (!isAudioOnly(state.node.media_file)) {
    return resetInputCooldown;
  }

  return {
    state: [
      {
        mutation: {
          mediaComponent: state.lastMediaComponents.right,
          lastMediaComponents: {
            ...state.lastMediaComponents,
            left: state.mediaComponent,
          },
          mediaSide: MediaSide.Right,
          inputCooldown: 0,
        },
      },
    ],
  };
};

export const changeMediaSideToLeft = (state: State): GameEvent => {
  return {
    state: [
      {
        mutation: {
          mediaComponent: state.lastMediaComponents.left,
          lastMediaComponents: {
            ...state.lastMediaComponents,
            right: state.mediaComponent,
          },
          mediaSide: MediaSide.Left,
          inputCooldown: 0,
        },
      },
    ],
  };
};

export const playMedia = (state: State): GameEvent => {
  const mediaElement = document.getElementById("media") as HTMLMediaElement;

  if (!state.node) {
    logError(state, "error: node was null while trying to play media");
    return resetInputCooldown;
  }

  if (!mediaElement.paused) {
    return resetInputCooldown;
  }

  if (isAudioOnly(state.node.media_file)) {
    return playMediaAudio;
  } else {
    return playMediaMovie;
  }
};

const playMediaMovie: GameEvent = {
  state: [
    {
      mutation: {
        mediaComponent: MediaComponent.Exit,
        inputCooldown: 1200,
      },
    },
  ],
  audio: [{ sfx: ["snd_28.mp4"] }],
  effects: [
    () => {
      setTimeout(() => playMediaElement(), 1200);
    },
  ],
};

const playMediaAudio: GameEvent = {
  state: [{ mutation: { mediaPercentageElapsed: 0, inputCooldown: 500 } }],
  audio: [{ sfx: ["snd_28.mp4"] }],
  effects: [playMediaElement],
};

export const exitMedia: GameEvent = {
  state: [
    {
      mutation: {
        scene: GameScene.Main,
        inputCooldown: -1,
      },
    },
  ],
  effects: [resetMediaElement],
  additionalEvents: [{ event: resetMediaScene }],
};

export const changeRightMediaComponent = (
  state: State,
  direction: Direction.Up | Direction.Down
): GameEvent => {
  let newStateIdx;
  if (direction === Direction.Up) {
    newStateIdx = state.wordStateIdx - 1 < 0 ? 5 : state.wordStateIdx - 1;
  } else {
    newStateIdx = state.wordStateIdx + 1 > 5 ? 0 : state.wordStateIdx + 1;
  }

  const newState = WORD_STATES[newStateIdx];

  return {
    state: [
      {
        mutation: {
          mediaComponent: newState.active,
          wordStateIdx: newStateIdx,
          inputCooldown: 300,
        },
      },
    ],
    audio: [{ sfx: ["snd_1.mp4"] }],
  };
};

export const wordNotFound: GameEvent = {
  state: [
    {
      mutation: {
        scene: GameScene.Main,
        wordNotFound: true,
        inputCooldown: 300,
      },
    },
  ],
  audio: [{ sfx: ["snd_30.mp4"] }],
  effects: [resetMediaElement],
  additionalEvents: [{ event: resetMediaScene }],
};

export const hideWordNotFound: GameEvent = {
  state: [{ mutation: { wordNotFound: false, inputCooldown: 0 } }],
};

export const selectWord = (state: State): GameEvent => {
  let wordIdx = null;
  switch (state.mediaComponent) {
    case MediaComponent.FirstWord:
      wordIdx = 0;
      break;
    case MediaComponent.SecondWord:
      wordIdx = 1;
      break;
    case MediaComponent.ThirdWord:
      wordIdx = 2;
      break;
  }

  if (!state.node) {
    logError(state, "error: node was null while trying to select word");
    return resetInputCooldown;
  }

  if (wordIdx === null) {
    logError(
      state,
      `error: couldn't find word index for current component: ${state.mediaComponent}. 
       node: ${state.node.id}`
    );
    return resetInputCooldown;
  }

  const wordToFind = state.node.words[wordIdx];
  if (wordToFind === null) {
    logError(state, "error: word to find was null");
    return resetInputCooldown;
  }

  const node = findNodeFromWord(wordToFind, state.node);
  if (!isNodeVisible(node, state.gameProgress)) {
    return wordNotFound;
  }

  const nodeMatrixIndex = { row: getRowForPosition(node.position), col: 0 };
  const segment = findSegmentForNodeAtCol(node, 0);

  if (segment !== undefined) {
    return {
      state: [
        {
          mutation: {
            level: node.level,
            node: node,
            nodeMatrixIndex: nodeMatrixIndex,
            siteSegment: segment,
            wordSelected: true,
            scene: GameScene.Main,
            inputCooldown: -1,
          },
        },
      ],
      audio: [{ sfx: ["snd_29.mp4"] }],
      effects: [resetMediaElement],
      additionalEvents: [{ event: resetMediaScene }],
    };
  } else {
    logError(
      state,
      `error: couldn't find segment node with node ${node.id} at 0th column`
    );
    return resetInputCooldown;
  }
};

export const setAudioAnalyser = (analyser: AudioAnalyser) => ({
  state: [
    {
      mutation: { audioAnalyser: analyser },
    },
  ],
});

export const setShowingAbout = (to: boolean): GameEvent => ({
  state: [
    {
      mutation: { showingAbout: to },
    },
  ],
});

export const changeSsknComponent = (
  direction: Direction.Up | Direction.Down
): GameEvent => ({
  state: [
    {
      mutation: {
        ssknComponent:
          direction === Direction.Up ? SsknComponent.Ok : SsknComponent.Cancel,
        inputCooldown: 100,
      },
    },
  ],
});

export const upgradeSskn = (state: State): GameEvent => {
  if (!state.node) {
    logError(state, "error: node was null while trying to upgrade sskn");
    return resetInputCooldown;
  }

  const newProgress = {
    ...state.gameProgress,
    sskn_level: state.gameProgress.sskn_level + 1,
  };

  return {
    state: [
      {
        mutation: {
          ssknLoading: true,
          inputCooldown: -1,
          gameProgress: newProgress,
        },
      },
    ],
    additionalEvents: [
      { event: setNodeViewed(newProgress, state.node) },
      { event: exitSskn, delay: 6000 },
    ],
  };
};

export const exitSskn: GameEvent = {
  state: [
    {
      mutation: {
        scene: GameScene.Main,
        ssknLoading: false,
        ssknComponent: SsknComponent.Ok,
        inputCooldown: -1,
      },
    },
  ],
};

export const exitToMain: GameEvent = {
  state: [
    {
      mutation: {
        scene: GameScene.Main,
      },
    },
  ],
};

export const changeEndComponent = (
  direction: Direction.Up | Direction.Down
): GameEvent => ({
  state: [
    {
      mutation: {
        endComponent:
          direction === Direction.Up ? EndComponent.End : EndComponent.Continue,
        inputCooldown: 100,
      },
    },
  ],
  audio: [{ sfx: ["snd_1.mp4"] }],
});

export const endGame = (state: State): GameEvent => ({
  state: [
    {
      mutation: {
        scene: GameScene.Boot,
        inputCooldown: -1,
        mainMenuComponent: MainMenuComponent.AuthorizeUser,
        letterMatrixIndex: { row: 1, col: 7 },
        bootSubscene: BootSubscene.MainMenu,
        playerName: "",
      },
    },
  ],
  audio: [{ sfx: ["snd_0.mp4"] }],
  effects: [() => saveUserProgress(state)],
});

export const changeMainMenuComponent = (
  direction: Direction.Up | Direction.Down
): GameEvent => ({
  state: [
    {
      mutation: {
        mainMenuComponent:
          direction === Direction.Up
            ? MainMenuComponent.AuthorizeUser
            : MainMenuComponent.LoadData,
        inputCooldown: 100,
      },
    },
  ],
  audio: [{ sfx: ["snd_1.mp4"] }],
});

export const exitLoadData: GameEvent = {
  state: [
    {
      mutation: {
        bootSubscene: BootSubscene.MainMenu,
        promptVisible: false,
        promptComponent: PromptComponent.No,
        inputCooldown: 500,
      },
    },
  ],
  audio: [{ sfx: ["snd_29.mp4"] }],
};

export const enterLoadData: GameEvent = {
  state: [
    { mutation: { bootSubscene: BootSubscene.LoadData, inputCooldown: 500 } },
    { mutation: { promptVisible: true }, delay: 500 },
  ],
  audio: [{ sfx: ["snd_0.mp4"] }],
};

export const enterUserAuthorization: GameEvent = {
  state: [
    {
      mutation: {
        bootSubscene: BootSubscene.AuthorizeUser,
        inputCooldown: 500,
      },
    },
  ],
  audio: [{ sfx: ["snd_0.mp4"] }],
};

export const exitUserAuthorization: GameEvent = {
  state: [
    {
      mutation: {
        playerName: "",
        bootSubscene: BootSubscene.MainMenu,
        inputCooldown: 500,
        letterMatrixIndex: { row: 1, col: 7 },
      },
    },
  ],
  audio: [{ sfx: ["snd_29.mp4"] }],
};

export const tryStartNewGame = (state: State): GameEvent => {
  if (state.playerName.length < 0) {
    return {};
  }

  return {
    state: [
      {
        mutation: {
          scene: GameScene.Main,
          intro: true,
          inputCooldown: -1,
        },
      },
    ],
    additionalEvents: [{ event: resetGameState }],
  };
};

export const updatePlayerName = (state: State): GameEvent => {
  const chosenCharacter = getCharacter(state.letterMatrixIndex);

  if (chosenCharacter) {
    const newName = addCharacter(state.playerName, chosenCharacter);

    if (newName.length > 8) {
      return {};
    }

    return {
      state: [
        {
          mutation: { playerName: newName, inputCooldown: 100 },
        },
      ],
      audio: [{ sfx: ["snd_0.mp4"] }],
    };
  }

  return {};
};

export const removePlayerNameLastChar = (state: State): GameEvent => {
  return {
    state: [{ mutation: { playerName: state.playerName.slice(0, -1) } }],
    audio: [{ sfx: ["snd_29.mp4"] }],
  };
};

export const failUpdatePlayerName = {
  audio: [{ sfx: ["snd_0.mp4"] }],
};

export const updateLetterMatrixIndex = (
  state: State,
  direction: Direction
): GameEvent => {
  const newMatrixIndices = moveCursor(state.letterMatrixIndex, direction);

  return {
    state: [
      {
        mutation: {
          inputCooldown: 0,
          letterMatrixIndex: newMatrixIndices,
        },
      },
    ],
  };
};

export const playIdleMedia = (data: IdleSceneData): GameEvent => {
  return {
    state: [
      {
        mutation: {
          cameraTiltValue: 0,
          idleStarting: true,
          inputCooldown: -1,
          idleSceneData: data,
        },
      },
      { mutation: { scene: GameScene.Idle }, delay: 1200 },
    ],
  };
};

export const playLainIdleAnim = (
  animation: LainAnimation,
  duration: number
): GameEvent => ({
  state: [
    {
      mutation: {
        lainAnimation: animation,
      },
    },
    {
      mutation: { lainAnimation: LainAnimation.Standing },
      delay: duration,
    },
  ],
});

export const toggleProtocolLines = (state: State) => {
  if (state.node !== null && isNodeVisible(state.node, state.gameProgress)) {
    return {
      state: [
        {
          mutation: {
            protocolLinesEnabled: !state.protocolLinesEnabled,
            inputCooldown: 0,
          },
        },
      ],
    };
  } else {
    return resetInputCooldown;
  }
};

export const invertCameraTilt = (state: State) => ({
  state: [
    {
      mutation: {
        cameraTiltValue: -state.lastCameraTiltValue,
        inputCooldown: 100,
      },
    },
  ],
});

export const resetCameraTilt = (state: State) => ({
  state: [
    {
      mutation: {
        cameraTiltValue: 0,
        lastCameraTiltValue: -state.lastCameraTiltValue,
        inputCooldown: 100,
      },
    },
  ],
});

export const resetInputCooldown = {
  state: [{ mutation: { inputCooldown: 0 } }],
};

export const setInputCooldown = (to: number) => {
  return {
    state: [{ mutation: { inputCooldown: to } }],
  };
};

export const setNodeViewed = (
  gameProgress: GameProgress,
  node: NodeData
): GameEvent => {
  const newProgress = {
    ...gameProgress,
    nodes: {
      ...gameProgress.nodes,
      [node.id]: { is_viewed: true },
    },
  };

  return {
    state: [
      {
        mutation: {
          gameProgress: newProgress,
        },
      },
    ],
    additionalEvents: [{ event: updateLayouts(newProgress) }],
  };
};

export const incrementFinalVideoViewCount = (gameProgress: GameProgress) => {
  const newProgress = {
    ...gameProgress,
    final_video_viewcount: gameProgress.final_video_viewcount + 1,
  };

  return {
    state: [
      {
        mutation: {
          gameProgress: newProgress,
        },
      },
    ],
    additionalEvents: [{ event: updateLayouts(newProgress) }],
  };
};

export const updateLayouts = (gameProgress: GameProgress): GameEvent => {
  return {
    state: [
      {
        mutation: {
          siteLayouts: {
            [GameSite.A]: filterInvisibleNodes(
              getLayout(GameSite.A),
              gameProgress
            ),
            [GameSite.B]: filterInvisibleNodes(
              getLayout(GameSite.B),
              gameProgress
            ),
          },
        },
      },
    ],
  };
};
