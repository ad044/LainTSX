import { NodeData } from "../components/MainScene/Site/Site";
import * as audio from "../static/sfx";
import {
  nodeExplodeAnimation,
  nodeKnockAndFallAnimation,
  nodeKnockAnimation,
  nodeRipAnimation,
  nodeThrowAnimation,
} from "../utils/node-animations";
import { playAudio } from "../store";

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
        inputCooldown: true,
      },
      delay: 0,
    },
    {
      mutation: {
        activeNode: calculatedState.activeNode,
        lainMoveState: "standing",
        inputCooldown: false,
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
        inputCooldown: true,
      },
      delay: 0,
    },
    {
      mutation: {
        activeNode: calculatedState.activeNode,
        lainMoveState: "standing",
        inputCooldown: false,
      },
      delay: 3900,
    },
  ],
  audio: [
    { sfx: [audio.sound13], delay: 0 },
    { sfx: [audio.sound10, audio.sound9], delay: 1300 },
    { sfx: [audio.sound8], delay: 2700 },
  ],
});

export const changeNode = (calculatedState: { activeNode: NodeData }) => ({
  state: [{ mutation: { activeNode: calculatedState.activeNode }, delay: 0 }],
  audio: [{ sfx: [audio.sound1], delay: 0 }],
});

export const throwNode = (calculatedState: { currentScene: string }) => ({
  state: [
    {
      mutation: { lainMoveState: "throw_node", inputCooldown: true },
      delay: 0,
    },
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
    { sfx: [audio.sound0], delay: 0 },
    { sfx: [audio.sound12], delay: 1600 },
    { sfx: [audio.sound13, audio.sound14], delay: 2800 },
  ],
});

export const ripNode = (calculatedState: { currentScene: string }) => ({
  state: [
    {
      mutation: { lainMoveState: "rip_node", inputCooldown: true },
      delay: 0,
    },
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
    { sfx: [audio.sound0], delay: 0 },
    { sfx: [audio.sound12], delay: 1600 },
    { sfx: [audio.sound13, audio.sound15], delay: 4000 },
  ],
});

export const explodeNode = {
  state: [
    {
      mutation: {
        lainMoveState: "touch_node_and_get_scared",
        inputCooldown: true,
      },
      delay: 0,
    },
    {
      mutation: { lainMoveState: "standing", inputCooldown: false },
      delay: 3800,
    },
  ],
  effects: [nodeExplodeAnimation],
  audio: [
    { sfx: [audio.sound0], delay: 0 },
    { sfx: [audio.sound17], delay: 2400 },
    { sfx: [audio.sound33], delay: 3150 },
  ],
};

export const knockNode = {
  state: [
    { mutation: { lainMoveState: "knock", inputCooldown: true }, delay: 0 },
    {
      mutation: { lainMoveState: "standing", inputCooldown: false },
      delay: 2900,
    },
  ],
  effects: [nodeKnockAnimation],
  audio: [
    { sfx: [audio.sound0], delay: 0 },
    { sfx: [audio.sound18], delay: 1200 },
  ],
};

export const knockNodeAndFall = {
  state: [
    {
      mutation: { lainMoveState: "knock_and_fall", inputCooldown: true },
      delay: 0,
    },
    {
      mutation: { lainMoveState: "standing", inputCooldown: false },
      delay: 7500,
    },
  ],
  effects: [nodeKnockAndFallAnimation],
  audio: [
    { sfx: [audio.sound0], delay: 0 },
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
      },
      delay: 0,
    },
  ],
  audio: [{ sfx: [audio.sound1], delay: 0 }],
});

export const exitLevelSelection = {
  state: [{ mutation: { mainSubscene: "site" }, delay: 0 }],
  audio: [{ sfx: [audio.sound1], delay: 0 }],
};

export const changeSelectedLevel = (calculatedState: {
  selectedLevel: number;
}) => ({
  state: [
    { mutation: { selectedLevel: calculatedState.selectedLevel }, delay: 0 },
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
        inputCooldown: true,
      },
      delay: 0,
    },
    {
      mutation: {
        activeNode: calculatedState.activeNode,
        lainMoveState: "standing",
        inputCooldown: false,
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
        inputCooldown: true,
      },
      delay: 0,
    },
    {
      mutation: { siteRot: calculatedState.siteRot },
      delay: 3600,
    },
  ],
  audio: [
    { sfx: [audio.sound7], delay: 0 },
    { sfx: [audio.sound23], delay: 3600 },
  ],
});

export const changePauseComponent = (calculatedState: {
  activePauseComponent: string;
}) => ({
  state: [
    {
      mutation: { activePauseComponent: calculatedState.activePauseComponent },
      delay: 0,
    },
  ],
  audio: [{ sfx: [audio.sound1], delay: 0 }],
});

export const showPermissionDenied = {
  state: [
    { mutation: { permissionDenied: true }, delay: 0 },
    { mutation: { permissionDenied: false }, delay: 1200 },
  ],
  audio: [{ sfx: [audio.sound0], delay: 0 }],
};

export const displayPrompt = {
  state: [{ mutation: { promptVisible: true }, delay: 0 }],
  audio: [{ sfx: [audio.sound0], delay: 0 }],
};

export const showAbout = {
  state: [{ mutation: { showingAbout: true }, delay: 0 }],
  audio: [{ sfx: [audio.sound0], delay: 0 }],
};

export const exitPause = (calculatedState: { siteRot: number[] }) => ({
  state: [
    {
      mutation: {
        siteRot: calculatedState.siteRot,
        pauseExitAnimation: true,
        activePauseComponent: "change",
        inputCooldown: true,
      },
      delay: 0,
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
  audio: [{ sfx: [audio.sound0], delay: 0 }],
});

export const exitAbout = {
  state: [{ mutation: { showingAbout: false }, delay: 0 }],
};

export const changePromptComponent = (calculatedState: {
  activePromptComponent: "yes" | "no";
}) => ({
  state: [
    {
      mutation: {
        activePromptComponent: calculatedState.activePromptComponent,
      },
      delay: 0,
    },
  ],
  audio: [{ sfx: [audio.sound1], delay: 0 }],
});

export const exitPrompt = {
  state: [
    {
      mutation: { activePromptComponent: "no", promptVisible: false },
      delay: 0,
    },
  ],
  audio: [{ sfx: [audio.sound28], delay: 0 }],
};

// todo actually save
export const saveGame = () => ({
  state: [
    {
      mutation: { saveSuccessful: true },
      delay: 0,
    },
    {
      mutation: { saveSuccessful: undefined },
      delay: 1200,
    },
  ],
  audio: [{ sfx: [audio.sound28], delay: 0 }],
});

// todo actually load
export const loadGame = () => ({
  state: [
    {
      mutation: { loadSuccessful: true },
      delay: 0,
    },
    {
      mutation: { loadSuccessful: undefined },
      delay: 1200,
    },
  ],
  audio: [{ sfx: [audio.sound28], delay: 0 }],
});

export const changeSite = (calculatedState: {
  newActiveSite: "a" | "b";
  newActiveNode: NodeData;
  newActiveLevel: string;
  newSiteRot: number[];
  newSiteSaveState: {
    a: {
      activeNode: NodeData;
      siteRot: number[];
      activeLevel: string;
    };
    b: {
      activeNode: NodeData;
      siteRot: number[];
      activeLevel: string;
    };
  };
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
      },
      delay: 0,
    },
  ],
});

export const changeLeftMediaComponent = (calculatedState: {
  activeComponent: "play" | "exit";
}) => ({
  state: [
    { mutation: { activeMediaComponent: calculatedState.activeComponent } },
  ],
  audio: [{ sfx: [audio.sound1], delay: 0 }],
});

export const changeMediaSide = (calculatedState: {
  activeMediaComponent: "fstWord" | "sndWord" | "thirdWord" | "exit" | "play";
  lastActiveMediaComponents: {
    left: "play" | "exit";
    right: "fstWord" | "sndWord" | "thirdWord";
  };
  currentMediaSide: "right" | "left";
}) => ({});
