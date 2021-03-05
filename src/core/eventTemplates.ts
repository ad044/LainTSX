import * as audio from "../static/audio/sfx";
import {
  nodeExplodeAnimation,
  nodeKnockAndFallAnimation,
  nodeKnockAnimation,
  nodeRipAnimation,
  nodeThrowAnimation,
} from "../helpers/node-animation-helpers";
import { playMediaElement, resetMediaElement } from "../helpers/media-helpers";
import {
  ActiveSite,
  AuthorizeUserMatrixIndices,
  EndComponent,
  GameScene,
  LeftMediaComponent,
  MediaComponent,
  MediaSide,
  NodeData,
  PromptComponent,
  RightMediaComponent,
  SiteSaveState,
  SsknComponent,
  UserSaveState,
} from "../types/types";
import { saveUserProgress, useStore } from "../store";

const setNodeViewed = useStore.getState().setNodeViewed;
const resetMediaScene = useStore.getState().resetMediaScene;
const loadUserSaveState = useStore.getState().loadUserSaveState;

export const siteMoveHorizontal = (calculatedState: {
  lainMoveAnimation: string;
  siteRot: number[];
  activeNode: NodeData;
}) => ({
  state: [
    {
      mutation: {
        lainMoveState: calculatedState.lainMoveAnimation,
        siteRot: calculatedState.siteRot,
        inputCooldown: 5500,
      },
    },
    {
      mutation: {
        activeNode: calculatedState.activeNode,
        lainMoveState: "standing",
      },
      delay: 3900,
    },
  ],
  audio: [{ sfx: [audio.sound6, audio.sound34], delay: 1100 }],
});

export const siteMoveVertical = (calculatedState: {
  lainMoveAnimation: string;
  activeLevel: string;
  activeNode: NodeData;
}) => ({
  state: [
    {
      mutation: {
        lainMoveState: calculatedState.lainMoveAnimation,
        activeLevel: calculatedState.activeLevel,
        inputCooldown: 5500,
      },
    },
    {
      mutation: {
        activeNode: calculatedState.activeNode,
        lainMoveState: "standing",
      },
      delay: 3900,
    },
  ],
  audio: [
    { sfx: [audio.sound13] },
    { sfx: [audio.sound10, audio.sound9], delay: 1300 },
    { sfx: [audio.sound8], delay: 2700 },
  ],
});

export const changeNode = (calculatedState: { activeNode: NodeData }) => ({
  state: [
    {
      mutation: { activeNode: calculatedState.activeNode, inputCooldown: 1500 },
    },
  ],
  audio: [{ sfx: [audio.sound1] }],
});

export const throwNode = (calculatedState: { currentScene: GameScene }) => ({
  state: [
    { mutation: { lainMoveState: "throw_node", inputCooldown: -1 } },
    {
      mutation: {
        currentScene: calculatedState.currentScene,
        intro: false,
        lainMoveState: "standing",
      },
      delay: 3450,
    },
  ],
  effects: [nodeThrowAnimation],
  audio: [
    { sfx: [audio.sound0] },
    { sfx: [audio.sound12], delay: 1600 },
    { sfx: [audio.sound13, audio.sound14], delay: 2800 },
  ],
});

export const ripNode = (calculatedState: { currentScene: GameScene }) => ({
  state: [
    { mutation: { lainMoveState: "rip_node", inputCooldown: -1 } },
    {
      mutation: {
        currentScene: calculatedState.currentScene,
        intro: false,
        lainMoveState: "standing",
      },
      delay: 6000,
    },
  ],
  effects: [nodeRipAnimation],
  audio: [
    { sfx: [audio.sound0] },
    { sfx: [audio.sound12], delay: 1600 },
    { sfx: [audio.sound13, audio.sound15], delay: 4000 },
  ],
});

export const explodeNode = {
  state: [
    {
      mutation: {
        lainMoveState: "touch_node_and_get_scared",
        inputCooldown: 3800,
      },
    },
    {
      mutation: { lainMoveState: "standing" },
      delay: 3800,
    },
  ],
  effects: [nodeExplodeAnimation],
  audio: [
    { sfx: [audio.sound0] },
    { sfx: [audio.sound17], delay: 2400 },
    { sfx: [audio.sound33], delay: 3150 },
  ],
};

export const knockNode = {
  state: [
    { mutation: { lainMoveState: "knock", inputCooldown: 3500 } },
    {
      mutation: { lainMoveState: "standing" },
      delay: 3500,
    },
  ],
  effects: [nodeKnockAnimation],
  audio: [{ sfx: [audio.sound0] }, { sfx: [audio.sound18], delay: 1200 }],
};

export const knockNodeAndFall = {
  state: [
    { mutation: { lainMoveState: "knock_and_fall", inputCooldown: 6000 } },
    { mutation: { lainMoveState: "standing" }, delay: 6000 },
  ],
  effects: [nodeKnockAndFallAnimation],
  audio: [
    { sfx: [audio.sound0] },
    { sfx: [audio.sound18], delay: 1200 },
    { sfx: [audio.sound19], delay: 2300 },
    { sfx: [audio.sound33], delay: 3150 },
  ],
};

export const enterLevelSelection = (calculatedState: {
  selectedLevel: number;
}) => ({
  state: [
    {
      mutation: {
        selectedLevel: calculatedState.selectedLevel,
        mainSubscene: "level_selection",
        inputCooldown: 1500,
      },
    },
  ],
  audio: [{ sfx: [audio.sound1] }],
});

export const exitLevelSelection = {
  state: [{ mutation: { mainSubscene: "site", inputCooldown: 1500 } }],
  audio: [{ sfx: [audio.sound1] }],
};

export const changeSelectedLevel = (calculatedState: {
  selectedLevel: number;
}) => ({
  state: [
    {
      mutation: {
        selectedLevel: calculatedState.selectedLevel,
        inputCooldown: 100,
      },
    },
  ],
});

export const selectLevel = (calculatedState: {
  lainMoveState: string;
  activeLevel: string;
  activeNode: NodeData;
}) => ({
  state: [
    {
      mutation: {
        lainMoveState: calculatedState.lainMoveState,
        activeLevel: calculatedState.activeLevel,
        mainSubscene: "site",
        inputCooldown: 5500,
      },
    },
    {
      mutation: {
        activeNode: calculatedState.activeNode,
        lainMoveState: "standing",
      },
      delay: 3900,
    },
  ],
  audio: [
    { sfx: [audio.sound10, audio.sound9], delay: 1300 },
    { sfx: [audio.sound8], delay: 2700 },
  ],
});

export const pauseGame = (calculatedState: { siteRot: number[] }) => ({
  state: [
    {
      mutation: {
        lainMoveState: "rip_middle_ring",
        pauseExitAnimation: false,
        mainSubscene: "pause",
        inputCooldown: -1,
      },
    },
    {
      mutation: { siteRot: calculatedState.siteRot },
      delay: 3600,
    },
  ],
  audio: [{ sfx: [audio.sound7] }, { sfx: [audio.sound23], delay: 3600 }],
});

export const changePauseComponent = (calculatedState: {
  activePauseComponent: string;
}) => ({
  state: [
    {
      mutation: {
        activePauseComponent: calculatedState.activePauseComponent,
        inputCooldown: 700,
      },
    },
  ],
  audio: [{ sfx: [audio.sound1] }],
});

export const showPermissionDenied = {
  state: [
    { mutation: { permissionDenied: true, inputCooldown: 1200 } },
    { mutation: { permissionDenied: false }, delay: 1200 },
  ],
  audio: [{ sfx: [audio.sound0] }],
};

export const displayPrompt = {
  state: [{ mutation: { promptVisible: true, inputCooldown: 0 } }],
  audio: [{ sfx: [audio.sound0] }],
};

export const showAbout = {
  state: [{ mutation: { showingAbout: true } }],
  audio: [{ sfx: [audio.sound0] }],
};

export const exitPause = (calculatedState: { siteRot: number[] }) => ({
  state: [
    {
      mutation: {
        siteRot: calculatedState.siteRot,
        inputCooldown: 1400,
        mainSubscene: "site",
        activePauseComponent: "",
      },
    },
    {
      mutation: {
        activePauseComponent: "change",
        inputCooldown: false,
        lainMoveState: "standing",
      },
      delay: 1200,
    },
  ],
  audio: [{ sfx: [audio.sound0] }],
});

export const exitAbout = {
  state: [{ mutation: { showingAbout: false, inputCooldown: 0 } }],
};

export const changePromptComponent = (calculatedState: {
  activePromptComponent: PromptComponent;
}) => ({
  state: [
    {
      mutation: {
        activePromptComponent: calculatedState.activePromptComponent,
        inputCooldown: 100,
      },
    },
  ],
  audio: [{ sfx: [audio.sound1] }],
});

export const exitPrompt = {
  state: [
    {
      mutation: {
        activePromptComponent: "no",
        promptVisible: false,
        inputCooldown: 0,
      },
    },
  ],
  audio: [{ sfx: [audio.sound28] }],
};

export const saveGame = (calculatedState: {
  userSaveState: UserSaveState;
}) => ({
  state: [
    { mutation: { saveSuccessful: true, inputCooldown: 1200 } },
    {
      mutation: {
        saveSuccessful: undefined,
        promptVisible: false,
        activePromptComponent: "no",
      },
      delay: 1200,
    },
  ],
  audio: [{ sfx: [audio.sound28] }],
  effects: [() => saveUserProgress(calculatedState.userSaveState)],
});

export const loadGameFail = {
  state: [
    {
      mutation: {
        loadSuccessful: false,
        inputCooldown: 1200,
      },
    },
    { mutation: { loadSuccessful: undefined }, delay: 1200 },
  ],
  audio: [{ sfx: [audio.sound28] }],
};

export const loadGame = (calculatedState: {
  userSaveState: UserSaveState;
}) => ({
  state: [
    { mutation: { loadSuccessful: true, inputCooldown: 1200 } },
    {
      mutation: {
        loadSuccessful: undefined,
        currentScene: "null",
        mainSubscene: "site",
        lainMoveState: "standing",
        promptVisible: false,
        activePromptComponent: "no",
        activePauseComponent: "change",
      },
      delay: 1200,
    },
    {
      mutation: { currentScene: "main", intro: true },
      delay: 1300,
    },
  ],
  audio: [{ sfx: [audio.sound28] }],
  effects: [
    () =>
      setTimeout(() => loadUserSaveState(calculatedState.userSaveState), 1200),
  ],
});

export const changeSite = (calculatedState: {
  newActiveSite: ActiveSite;
  newActiveNode: NodeData;
  newActiveLevel: string;
  newSiteRot: number[];
  newSiteSaveState: SiteSaveState;
}) => ({
  state: [
    {
      mutation: {
        intro: true,
        currentScene: "change_disc",
        lainMoveState: "standing",
        promptVisible: false,
        activePromptComponent: "no",
        mainSubscene: "site",
        // load state
        activeSite: calculatedState.newActiveSite,
        activeNode: calculatedState.newActiveNode,
        siteRot: calculatedState.newSiteRot,
        activeLevel: calculatedState.newActiveLevel,
        // save state
        siteSaveState: calculatedState.newSiteSaveState,
        inputCooldown: -1,
      },
    },
  ],
});

export const changeLeftMediaComponent = (calculatedState: {
  activeComponent: LeftMediaComponent;
}) => ({
  state: [
    {
      mutation: {
        activeMediaComponent: calculatedState.activeComponent,
        inputCooldown: 1200,
      },
    },
  ],
  audio: [{ sfx: [audio.sound1] }],
});

export const changeMediaSide = (calculatedState: {
  activeMediaComponent: MediaComponent;
  lastActiveMediaComponents: {
    left: LeftMediaComponent;
    right: RightMediaComponent;
  };
  currentMediaSide: MediaSide;
}) => ({
  state: [
    {
      mutation: {
        activeMediaComponent: calculatedState.activeMediaComponent,
        lastActiveMediaComponents: calculatedState.lastActiveMediaComponents,
        currentMediaSide: calculatedState.currentMediaSide,
        inputCooldown: 0,
      },
    },
  ],
});

export const playMedia = (calculatedState: { activeNode: NodeData }) => ({
  state: [{ mutation: { mediaPercentageElapsed: 0, inputCooldown: 500 } }],
  effects: [
    playMediaElement,
    () =>
      setNodeViewed(calculatedState.activeNode.node_name, {
        is_viewed: 1,
        is_visible: 1,
      }),
  ],
});

export const exitMedia = {
  state: [
    {
      mutation: {
        currentScene: "main",
        inputCooldown: -1,
      },
    },
  ],
  effects: [resetMediaElement, resetMediaScene],
};

export const changeRightMediaComponent = (calculatedState: {
  wordPosStateIdx: number;
  activeComponent: RightMediaComponent;
}) => ({
  state: [
    {
      mutation: {
        activeMediaComponent: calculatedState.activeComponent,
        mediaWordPosStateIdx: calculatedState.wordPosStateIdx,
        inputCooldown: 300,
      },
    },
  ],
  audio: [{ sfx: [audio.sound1] }],
});

export const wordNotFound = {
  state: [
    {
      mutation: {
        currentScene: "main",
        wordNotFound: true,
        inputCooldown: 300,
      },
    },
  ],
  audio: [{ sfx: [audio.sound30] }],
  effects: [resetMediaElement, resetMediaScene],
};

export const hideWordNotFound = {
  state: [{ mutation: { wordNotFound: false, inputCooldown: 0 } }],
};

export const selectWord = (calculatedState: {
  activeLevel: string;
  activeNode: NodeData;
  siteRot: number[];
}) => ({
  state: [
    {
      mutation: {
        activeLevel: calculatedState.activeLevel,
        siteRot: calculatedState.siteRot,
        activeNode: calculatedState.activeNode,
        wordSelected: true,
        currentScene: "main",
        inputCooldown: -1,
      },
    },
  ],
  audio: [{ sfx: [audio.sound29] }],
  effects: [resetMediaElement, resetMediaScene],
});

export const changeSsknComponent = (calculatedState: {
  activeSsknComponent: SsknComponent;
}) => ({
  state: [
    {
      mutation: {
        activeSsknComponent: calculatedState.activeSsknComponent,
        inputCooldown: 100,
      },
    },
  ],
});

export const upgradeSskn = (calculatedState: { activeNode: NodeData }) => ({
  state: [
    {
      mutation: {
        ssknLoading: true,
        inputCooldown: -1,
      },
    },
    { mutation: { currentScene: "main" }, delay: 6000 },
  ],
  effects: [
    () =>
      setNodeViewed(calculatedState.activeNode.node_name, {
        is_viewed: 1,
        is_visible: 0,
      }),
  ],
});

export const exitSskn = {
  state: [
    {
      mutation: {
        currentScene: "main",
        ssknLoading: false,
        activeSsknComponent: "ok",
        inputCooldown: -1,
      },
    },
  ],
};

export const changeEndComponent = (calculatedState: {
  activeEndComponent: EndComponent;
}) => ({
  state: [
    {
      mutation: {
        activeEndComponent: calculatedState.activeEndComponent,
        inputCooldown: 100,
      },
    },
  ],
  audio: [{ sfx: [audio.sound1] }],
});

export const endGame = (calculatedState: { userSaveState: UserSaveState }) => ({
  state: [{ mutation: { currentScene: "boot", inputCooldown: -1 } }],
  audio: [{ sfx: [audio.sound0] }],
  effects: [() => saveUserProgress(calculatedState.userSaveState)],
});

export const changeMainMenuComponent = (calculatedState: {
  activeMainMenuComponent: "authorize_user" | "load_data";
}) => ({
  state: [
    {
      mutation: {
        activeMainMenuComponent: calculatedState.activeMainMenuComponent,
        inputCooldown: 200,
      },
    },
  ],
  audio: [{ sfx: [audio.sound1] }],
});

export const exitLoadData = {
  state: [
    {
      mutation: {
        bootSubscene: "main_menu",
        promptVisible: false,
        activePromptComponent: "no",
        inputCooldown: 500,
      },
    },
  ],
  audio: [{ sfx: [audio.sound29] }],
};

export const enterLoadData = {
  state: [
    { mutation: { bootSubscene: "load_data", inputCooldown: 500 } },
    { mutation: { promptVisible: true }, delay: 500 },
  ],
  audio: [{ sfx: [audio.sound0] }],
};

export const enterUserAuthorization = {
  state: [
    {
      mutation: {
        bootSubscene: "authorize_user",
        inputCooldown: 500,
      },
    },
  ],
  audio: [{ sfx: [audio.sound0] }],
};

export const exitUserAuthorization = {
  state: [
    {
      mutation: {
        playerName: "",
        bootSubscene: "main_menu",
        inputCooldown: 500,
        authorizeUserMatrixIndices: { rowIdx: 1, colIdx: 7 },
      },
    },
  ],
  audio: [{ sfx: [audio.sound29] }],
};

export const startNewGame = {
  state: [
    { mutation: { currentScene: "main", intro: true, inputCooldown: -1 } },
  ],
};

export const updatePlayerName = (calculatedState: { playerName: string }) => ({
  state: [{ mutation: { playerName: calculatedState.playerName } }],
  audio: [{ sfx: [audio.sound0] }],
});

export const removePlayerNameLastChar = (calculatedState: {
  playerName: string;
}) => ({
  state: [{ mutation: { playerName: calculatedState.playerName } }],
  audio: [{ sfx: [audio.sound29] }],
});

export const failUpdatePlayerName = { audio: [{ sfx: [audio.sound0] }] };

export const updateAuthorizeUserLetterMatrixIndices = (calculatedState: {
  authorizeUserLetterMatrixIndices: AuthorizeUserMatrixIndices;
}) => ({
  state: [
    {
      mutation: {
        inputCooldown: 300,
        authorizeUserMatrixIndices:
          calculatedState.authorizeUserLetterMatrixIndices,
      },
    },
  ],
});

export const playIdleVideo = (calculatedState: { idleMedia: string }) => ({
  state: [
    {
      mutation: {
        idleStarting: true,
        idleMedia: calculatedState.idleMedia,
        idleImages: undefined,
        idleNodeName: undefined,
        inputCooldown: -1,
      },
    },
    { mutation: { currentScene: "idle_media" }, delay: 1200 },
  ],
});

export const playIdleAudio = (calculatedState: {
  idleMedia: string;
  idleImages: { "1": string; "2": string; "3": string };
  idleNodeName: string;
}) => ({
  state: [
    {
      mutation: {
        idleStarting: true,
        inputCooldown: -1,
        idleMedia: calculatedState.idleMedia,
        idleImages: calculatedState.idleImages,
        idleNodeName: calculatedState.idleNodeName,
      },
    },
    { mutation: { currentScene: "idle_media" }, delay: 1200 },
  ],
});

export const playLainIdleAnim = (calculatedState: {
  lainMoveState: string;
  duration: number;
}) => ({
  state: [
    {
      mutation: {
        lainMoveState: calculatedState.lainMoveState,
        canLainMove: false,
      },
    },
    {
      mutation: { lainMoveState: "standing", canLainMove: true },
      delay: calculatedState.duration,
    },
  ],
});

export const resetInputCooldown = {
  state: [{ mutation: { inputCooldown: 0 } }],
};
