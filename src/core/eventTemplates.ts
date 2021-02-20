import { NodeData } from "../components/MainScene/Site/Site";
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
  EndComponent,
  GameProgress,
  GameScene,
  LeftMediaComponent,
  MediaComponent,
  MediaSide,
  PromptComponent,
  RightMediaComponent,
  SiteSaveState,
  SsknComponent,
} from "../store";

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
    {
      mutation: { lainMoveState: "standing" },
    },
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
        inputCooldown: 300,
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
        inputCooldown: 500,
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
  state: [{ mutation: { promptVisible: true, inputCooldown: 500 } }],
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
        pauseExitAnimation: true,
        activePauseComponent: "change",
        inputCooldown: 1400,
      },
    },
    {
      mutation: {
        mainSubscene: "site",
        inputCooldown: false,
        lainMoveState: "standing",
      },
      delay: 1200,
    },
  ],
  audio: [{ sfx: [audio.sound0] }],
});

export const exitAbout = {
  state: [{ mutation: { showingAbout: false, inputCooldown: 500 } }],
};

export const changePromptComponent = (calculatedState: {
  activePromptComponent: PromptComponent;
}) => ({
  state: [
    {
      mutation: {
        activePromptComponent: calculatedState.activePromptComponent,
        inputCooldown: 500,
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
        inputCooldown: 500,
      },
    },
  ],
  audio: [{ sfx: [audio.sound28] }],
};

// todo actually save
export const saveGame = () => ({
  state: [
    { mutation: { saveSuccessful: true, inputCooldown: 1200 } },
    {
      mutation: { saveSuccessful: undefined },
      delay: 1200,
    },
  ],
  audio: [{ sfx: [audio.sound28] }],
});

// todo actually load
export const loadGame = () => ({
  state: [
    { mutation: { loadSuccessful: true, inputCooldown: 1200 } },
    {
      mutation: { loadSuccessful: undefined },
      delay: 1200,
    },
  ],
  audio: [{ sfx: [audio.sound28] }],
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
        inputCooldown: 500,
      },
    },
  ],
});

export const playMedia = {
  state: [{ mutation: { mediaPercentageElapsed: 0, inputCooldown: 500 } }],
  effects: [playMediaElement],
};

export const exitMedia = {
  state: [{ mutation: { currentScene: "main", inputCooldown: -1 } }],
  effects: [resetMediaElement],
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
        inputCooldown: 500,
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
  effects: [resetMediaElement],
};

export const hideWordNotFound = {
  state: [{ mutation: { wordNotFound: false, inputCooldown: 300 } }],
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
  effects: [resetMediaElement],
});

export const changeSsknComponent = (calculatedState: {
  activeSsknComponent: SsknComponent;
}) => ({
  state: [
    {
      mutation: {
        activeSsknComponent: calculatedState.activeSsknComponent,
        inputCooldown: 500,
      },
    },
  ],
});

export const upgradeSskn = (calculatedState: {
  gameProgress: GameProgress;
  ssknLvl: number;
}) => ({
  state: [
    {
      mutation: {
        gameProgress: calculatedState.gameProgress,
        ssknLvl: calculatedState.ssknLvl,
        ssknLoading: true,
        inputCooldown: -1,
      },
    },
    { mutation: { currentScene: "main" }, delay: 6000 },
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
        inputCooldown: 500,
      },
    },
  ],
  audio: [{ sfx: [audio.sound1] }],
});

export const endGame = {
  state: [{ mutation: { currentScene: "boot", inputCooldown: -1 } }],
  audio: [{ sfx: [audio.sound0] }],
};

// todo this is probably buggy
export const continueGameAfterEnd = {
  state: [
    {
      mutation: { currentScene: "change_disc", intro: true, inputCooldown: -1 },
    },
  ],
  audio: [{ sfx: [audio.sound0] }],
};

export const changeMainMenuComponent = (calculatedState: {
  activeMainMenuComponent: "authorize_user" | "load_data";
}) => ({
  state: [
    {
      mutation: {
        activeMainMenuComponent: calculatedState.activeMainMenuComponent,
        inputCooldown: 500,
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
        authorizeUserLetterIdx: 0,
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

export const updateAuthorizeUserLetterIdx = (calculatedState: {
  authorizeUserLetterIdx: number;
}) => ({
  state: [
    {
      mutation: {
        inputCooldown: 300,
        authorizeUserLetterIdx: calculatedState.authorizeUserLetterIdx,
      },
    },
  ],
});
