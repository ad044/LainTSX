import create from "zustand";
import { combine } from "zustand/middleware";
import * as THREE from "three";
import game_progress from "./resources/initial_progress.json";
import { NodeData } from "./components/MainScene/Site/Site";
import { getNodeById } from "./utils/node-utils";
import site_a from "./resources/site_a.json";

export type GameProgress = typeof game_progress;

type State = {
  currentScene: string;

  gameProgress: GameProgress;

  mainSubscene: string;

  intro: boolean;

  activeNode: NodeData;
  activeNodePos: number[];
  activeNodeRot: number[];
  activeNodeAttributes: {
    interactedWith: boolean;
    exploding: boolean;
    shrinking: boolean;
    visible: boolean;
  };

  // lain
  lainMoveState: string;

  // site
  activeSite: "a" | "b";
  siteRot: number[];
  oldSiteRot: number[];

  // level
  activeLevel: string;
  oldLevel: string;

  // level selection
  selectedLevel: number;

  // end scene
  activeEndComponent: "end" | "continue";
  endSceneSelectionVisible: boolean;

  // pause
  activePauseComponent: "load" | "about" | "change" | "save" | "exit";
  pauseExitAnimation: boolean;
  showingAbout: boolean;
  permissionDenied: boolean;

  // media/media scene
  audioAnalyser: any;
  mediaPercentageElapsed: number;
  currentMediaSide: "left" | "right";
  activeMediaComponent: "play" | "exit" | "fstWord" | "sndWord" | "thirdWord";
  lastActiveMediaComponents: {
    left: "play" | "exit";
    right: "fstWord" | "sndWord" | "thirdWord";
  };

  mediaWordPosStateIdx: number;
  wordSelected: boolean;

  // idle scene
  idleStarting: boolean;
  idleMedia: string;
  idleImages: { "1": string; "2": string; "3": string } | undefined;
  idleNodeName: string | undefined;

  // sskn scene
  activeSsknComponent: "ok" | "cancel";
  ssknLoading: boolean;
  ssknLvl: number;

  // polytan scene
  polytanUnlockedParts: {
    body: boolean;
    head: boolean;
    leftArm: boolean;
    rightArm: boolean;
    leftLeg: boolean;
    rightLeg: boolean;
  };

  // gate scene
  gateLvl: number;

  // player name
  playerName: string;

  // boot scene
  activeMainMenuComponent: "authorize_user" | "load_data";
  authorizeUserLetterIdx: number;
  bootSubscene: "main_menu" | "load_data" | "authorize_user";

  // prompt
  promptVisible: boolean;
  activePromptComponent: "yes" | "no";

  // status notifiers
  loadSuccessful: boolean | undefined;
  saveSuccessful: boolean | undefined;

  // save state
  siteSaveState: {
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

  inputCooldown: boolean;
};

export const useStore = create(
  combine(
    {
      // scene data
      currentScene: "media",

      // game progress
      gameProgress: game_progress,

      // main subscene
      mainSubscene: "site",

      // whether or not to play the intro anim on main scene
      intro: true,

      // nodes
      activeNode: {
        ...site_a["04"]["0422"],
        matrixIndices: { matrixIdx: 7, rowIdx: 0, colIdx: 0 },
      },
      activeNodePos: [0, 0, 0],
      activeNodeRot: [0, 0, 0],
      activeNodeAttributes: {
        interactedWith: false,
        exploding: false,
        shrinking: false,
        visible: true,
      },

      // lain
      lainMoveState: "standing",

      // site
      activeSite: "a",
      siteRot: [0, 0, 0],
      // this is used for word selection animation to start from the correct point
      oldSiteRot: [0, 0, 0],

      // level
      activeLevel: "04",
      // this is used for word selection animation to start from the correct point
      oldLevel: "04",

      // level selection
      selectedLevel: 4,

      // end scene
      activeEndComponent: "end",
      endSceneSelectionVisible: false,

      // pause
      activePauseComponent: "change",
      pauseExitAnimation: false,
      showingAbout: false,
      permissionDenied: false,

      // media scene
      audioAnalyser: undefined,
      mediaPercentageElapsed: 0,

      currentMediaSide: "left",
      activeMediaComponent: "play",
      lastActiveMediaComponents: {
        left: "play",
        right: "fstWord",
      },
      mediaWordPosStateIdx: 1,
      wordSelected: false,

      // idle scene
      idleStarting: false,
      idleMedia: site_a["00"]["0000"].media_file,
      idleNodeName: site_a["00"]["0000"].node_name,
      // this may be undefined depending on whether or not the media is audio or not
      idleImages: site_a["00"]["0000"].image_table_indices,

      // sskn scene
      activeSsknComponent: "ok",
      ssknLoading: false,
      ssknLvl: 0,

      // polytan scene
      polytanUnlockedParts: {
        body: false,
        head: false,
        leftArm: false,
        rightArm: false,
        leftLeg: false,
        rightLeg: false,
      },

      // gate scene
      gateLvl: 0,

      // player name
      playerName: "アイウエオ",

      // boot scene
      activeMainMenuComponent: "authorize_user",
      authorizeUserLetterIdx: 0,
      bootSubscene: "main_menu",

      // prompt
      promptVisible: false,
      activePromptComponent: "no",

      // status notifiers
      loadSuccessful: undefined,
      saveSuccessful: undefined,

      // save states for loading the game/changing sites
      siteSaveState: {
        a: {
          activeNode: {
            ...getNodeById("0422", "a"),
            matrixIndices: { matrixIdx: 7, rowIdx: 0, colIdx: 0 },
          },
          siteRot: [0, 0, 0],
          activeLevel: "04",
        },
        b: {
          activeNode: {
            ...getNodeById("0414", "b"),
            matrixIndices: { matrixIdx: 7, rowIdx: 1, colIdx: 0 },
          },
          siteRot: [0, 0, 0],
          activeLevel: "04",
        },
      },

      inputCooldown: false,
    } as State,
    (set) => ({
      // scene data setters
      setScene: (to: string) => set(() => ({ currentScene: to })),

      // node setters
      setNodePos: (to: number[]) => set(() => ({ activeNodePos: to })),
      setNodeRot: (to: number[]) => set(() => ({ activeNodeRot: to })),
      setNodeAttributes: (
        to: boolean,
        at: "interactedWith" | "visible" | "exploding" | "shrinking"
      ) =>
        set((state) => ({
          activeNodeAttributes: { ...state.activeNodeAttributes, [at]: to },
        })),

      // lain setters
      setLainMoveState: (to: string) => set(() => ({ lainMoveState: to })),

      // site setters
      setSiteRotX: (to: number) =>
        set((prev) => {
          const nextRot = [...prev.siteRot];
          nextRot[0] = to;
          return { siteRot: nextRot };
        }),

      // end scene setters
      setEndSceneSelectionVisible: (to: boolean) =>
        set(() => ({ endSceneSelectionVisible: to })),

      // pause setters
      setShowingAbout: (to: boolean) => set(() => ({ showingAbout: to })),

      // media scene setters
      setAudioAnalyser: (to: any) => set(() => ({ audioAnalyser: to })),
      setPercentageElapsed: (to: number) =>
        set(() => ({ mediaPercentageElapsed: to })),
      setWordSelected: (to: boolean) => set(() => ({ wordSelected: to })),
      updateLeftSide: (
        newActiveComponent: "fstWord" | "sndWord" | "thirdWord",
        lastActiveComponent: "exit" | "play"
      ) =>
        set((state) => ({
          activeMediaComponent: newActiveComponent,
          lastActiveMediaComponents: {
            ...state.lastActiveMediaComponents,
            left: lastActiveComponent,
          },
          currentMediaSide: "right",
        })),
      updateRightSide: (
        newActiveComponent: "play" | "exit",
        lastActiveComponent: "fstWord" | "sndWord" | "thirdWord"
      ) =>
        set((state) => ({
          activeMediaComponent: newActiveComponent,
          lastActiveMediaComponents: {
            ...state.lastActiveMediaComponents,
            right: lastActiveComponent,
          },
          currentMediaSide: "left",
        })),

      // idle media setters
      setIdleStarting: (to: boolean) => set(() => ({ idleStarting: to })),
      setIdleScene: (to: {
        images: { "1": string; "2": string; "3": string } | undefined;
        media: string | undefined;
        nodeName: string | undefined;
      }) =>
        set(() => ({
          idleMedia: to.media,
          idleImages: to.images,
          idleNodeName: to.nodeName,
        })),

      //polytan setters
      setPolytanPartUnlocked: (bodyPart: string) =>
        set((state) => ({
          polytanUnlockedParts: {
            ...state.polytanUnlockedParts,
            [bodyPart]: true,
          },
        })),

      changeSite: (to: "a" | "b") =>
        set((state) => {
          const newState = state.siteSaveState[to];
          return {
            currentScene: "change_disc",
            promptVisible: false,
            activePromptComponent: "no",
            mainSubscene: "site",
            // load new state
            activeSite: to,
            activeNode: newState.activeNode,
            siteRot: newState.siteRot,
            activeLevel: newState.activeLevel,
            // save current state
            siteSaveState: {
              ...state.siteSaveState,
              [to === "a" ? "b" : "a"]: {
                activeNode: state.activeNode,
                siteRot: [0, state.siteRot[1], 0],
                activeLevel: state.activeLevel,
              },
            },
          };
        }),

      // progress setters
      setNodeViewed: (
        nodeName: string,
        to: { is_viewed: number; is_visible: number }
      ) =>
        set((state) => ({
          gameProgress: {
            ...state.gameProgress,
            [nodeName]: to,
          },
        })),

      setInputCooldown: (to: boolean) => set(() => ({ inputCooldown: to })),
    })
  )
);

type PromptContext = {
  activePromptComponent: "yes" | "no";
  promptVisible: boolean;
};

const getPromptContext = () => {
  const state = useStore.getState();

  return {
    promptVisible: state.promptVisible,
    activePromptComponent: state.activePromptComponent,
  };
};

export interface MainSceneContext extends PromptContext {
  keyPress: string;
  ssknLvl: number;
  activeNode: NodeData;
  showingAbout: boolean;
  level: number;
  activePauseComponent: "load" | "about" | "change" | "save" | "exit";
  gameProgress: GameProgress;
  gateLvl: number;
  subscene: string;
  siteRotY: number;
  activeSite: "a" | "b";
  selectedLevel: number;
  siteSaveState: {
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
}

export const getMainSceneContext = (keyPress: string): MainSceneContext => {
  const state = useStore.getState();

  return {
    ...getPromptContext(),
    keyPress: keyPress,
    subscene: state.mainSubscene,
    selectedLevel: state.selectedLevel,
    activePauseComponent: state.activePauseComponent,
    gameProgress: state.gameProgress,
    activeSite: state.activeSite,
    siteRotY: state.siteRot[1],
    activeNode: state.activeNode,
    level: parseInt(state.activeLevel),
    ssknLvl: state.ssknLvl,
    showingAbout: state.showingAbout,
    gateLvl: state.gateLvl,
    siteSaveState: state.siteSaveState,
  };
};

export type SsknSceneContext = {
  keyPress: string;
  activeSsknComponent: "ok" | "cancel";
  activeNode: NodeData;
};

export const getSsknSceneContext = (keyPress: string): SsknSceneContext => {
  const state = useStore.getState();
  return {
    keyPress: keyPress,
    activeSsknComponent: state.activeSsknComponent,
    activeNode: state.activeNode,
  };
};

export type MediaSceneContext = {
  keyPress: string;
  wordPosStateIdx: number;
  currentMediaSide: "left" | "right";
  activeMediaComponent: "play" | "exit" | "fstWord" | "sndWord" | "thirdWord";
  activeNode: NodeData;
  gameProgress: GameProgress;
  lastActiveMediaComponents: {
    left: "play" | "exit";
    right: "fstWord" | "sndWord" | "thirdWord";
  };
  activeSite: "a" | "b";
};

export const getMediaSceneContext = (keyPress: string): MediaSceneContext => {
  const state = useStore.getState();

  return {
    keyPress: keyPress,
    lastActiveMediaComponents: state.lastActiveMediaComponents,
    currentMediaSide: state.currentMediaSide,
    activeMediaComponent: state.activeMediaComponent,
    wordPosStateIdx: state.mediaWordPosStateIdx,
    activeNode: state.activeNode,
    activeSite: state.activeSite,
    gameProgress: state.gameProgress,
  };
};

export interface BootSceneContext extends PromptContext {
  keyPress: string;
  playerName: string;
  subscene: "main_menu" | "load_data" | "authorize_user";
  activeMainMenuComponent: "load_data" | "authorize_user";
  authorizeUserLetterIdx: number;
}

export const getBootSceneContext = (keyPress: string): BootSceneContext => {
  const state = useStore.getState();

  return {
    ...getPromptContext(),
    keyPress: keyPress,
    playerName: state.playerName,
    subscene: state.bootSubscene,
    activeMainMenuComponent: state.activeMainMenuComponent,
    authorizeUserLetterIdx: state.authorizeUserLetterIdx,
  };
};

export type EndSceneContext = {
  keyPress: string;
  activeEndComponent: "end" | "continue";
  selectionVisible: boolean;
};

export const getEndSceneContext = (keyPress: string): EndSceneContext => {
  const state = useStore.getState();

  return {
    keyPress: keyPress,
    activeEndComponent: state.activeEndComponent,
    selectionVisible: state.endSceneSelectionVisible,
  };
};

export const playAudio = (audio: HTMLAudioElement) => {
  audio.currentTime = 0;
  audio.currentTime = 0;
  audio.volume = 0.5;
  audio.loop = false;
  audio.play();
};

export const createAudioAnalyser = () => {
  const mediaElement = document.getElementById("media") as HTMLMediaElement;
  const listener = new THREE.AudioListener();
  const audio = new THREE.Audio(listener);

  audio.setMediaElementSource(mediaElement);

  return new THREE.AudioAnalyser(audio, 2048);
};
