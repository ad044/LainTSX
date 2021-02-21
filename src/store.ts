import create from "zustand";
import { combine } from "zustand/middleware";
import * as THREE from "three";
import { AudioAnalyser } from "three";
import game_progress from "./resources/initial_progress.json";
import { NodeData } from "./components/MainScene/Site/Site";
import { getNodeById } from "./helpers/node-helpers";
import site_a from "./resources/site_a.json";

export type GameProgress = typeof game_progress;

type NodeAttributes = {
  interactedWith: boolean;
  exploding: boolean;
  shrinking: boolean;
  visible: boolean;
};

export type GameScene =
  | "main"
  | "media"
  | "tak"
  | "sskn"
  | "polytan"
  | "idle_media"
  | "gate"
  | "boot"
  | "change_disc"
  | "end";

type MainSubscene = "site" | "pause" | "level_selection";

export type ActiveSite = "a" | "b";

export type EndComponent = "end" | "continue";

export type PauseComponent = "load" | "about" | "change" | "save" | "exit";

export type MediaSide = "left" | "right";
export type LeftMediaComponent = "play" | "exit";
export type RightMediaComponent = "fstWord" | "sndWord" | "thirdWord";
export type MediaComponent = LeftMediaComponent | RightMediaComponent;

export type SiteSaveState = {
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

export type SsknComponent = "ok" | "cancel";

export type MainMenuComponent = "authorize_user" | "load_data";
export type BootSubscene = "main_menu" | "load_data" | "authorize_user";

export type PromptComponent = "yes" | "no";

type PolytanBodyParts = {
  body: boolean;
  head: boolean;
  leftArm: boolean;
  rightArm: boolean;
  leftLeg: boolean;
  rightLeg: boolean;
};

type State = {
  currentScene: GameScene;

  gameProgress: GameProgress;

  mainSubscene: MainSubscene;

  intro: boolean;

  activeNode: NodeData;
  activeNodePos: number[];
  activeNodeRot: number[];
  activeNodeAttributes: NodeAttributes;

  // lain
  lainMoveState: string;

  // site
  activeSite: ActiveSite;
  siteRot: number[];
  oldSiteRot: number[];

  // level
  activeLevel: string;
  oldLevel: string;

  // level selection
  selectedLevel: number;

  // end scene
  activeEndComponent: EndComponent;
  endSceneSelectionVisible: boolean;

  // pause
  activePauseComponent: PauseComponent;
  pauseExitAnimation: boolean;
  showingAbout: boolean;
  permissionDenied: boolean;

  // media/media scene
  audioAnalyser: AudioAnalyser | undefined;
  mediaPercentageElapsed: number;
  currentMediaSide: MediaSide;
  activeMediaComponent: MediaComponent;
  lastActiveMediaComponents: {
    left: LeftMediaComponent;
    right: RightMediaComponent;
  };

  mediaWordPosStateIdx: number;
  wordSelected: boolean;

  // idle scene
  idleStarting: boolean;
  idleMedia: string;
  idleImages: { "1": string; "2": string; "3": string } | undefined;
  idleNodeName: string | undefined;

  // sskn scene
  activeSsknComponent: SsknComponent;
  ssknLoading: boolean;

  // polytan scene
  polytanUnlockedParts: PolytanBodyParts;

  // player name
  playerName: string;

  // boot scene
  activeMainMenuComponent: MainMenuComponent;
  authorizeUserLetterIdx: number;
  bootSubscene: BootSubscene;

  // prompt
  promptVisible: boolean;
  activePromptComponent: PromptComponent;

  // status notifiers
  loadSuccessful: boolean | undefined;
  saveSuccessful: boolean | undefined;

  // word not found notification thing
  wordNotFound: boolean;

  // save state
  siteSaveState: SiteSaveState;

  inputCooldown: number;
};

export const useStore = create(
  combine(
    {
      // scene data
      currentScene: "main",

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

      // polytan scene
      polytanUnlockedParts: {
        body: false,
        head: false,
        leftArm: false,
        rightArm: false,
        leftLeg: false,
        rightLeg: false,
      },

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

      // word not found notification thing
      wordNotFound: false,

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

      inputCooldown: -1,
    } as State,
    (set) => ({
      setScene: (to: GameScene) => set(() => ({ currentScene: to })),

      setNodePos: (to: number[]) => set(() => ({ activeNodePos: to })),
      setNodeRot: (to: number[]) => set(() => ({ activeNodeRot: to })),
      setNodeAttributes: (
        to: boolean,
        at: "interactedWith" | "visible" | "exploding" | "shrinking"
      ) =>
        set((state) => ({
          activeNodeAttributes: { ...state.activeNodeAttributes, [at]: to },
        })),

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

      setLainMoveState: (to: string) => set(() => ({ lainMoveState: to })),

      setEndSceneSelectionVisible: (to: boolean) =>
        set(() => ({ endSceneSelectionVisible: to })),

      setShowingAbout: (to: boolean) => set(() => ({ showingAbout: to })),

      setAudioAnalyser: (to: AudioAnalyser) =>
        set(() => ({ audioAnalyser: to })),
      setPercentageElapsed: (to: number) =>
        set(() => ({ mediaPercentageElapsed: to })),
      setWordSelected: (to: boolean) => set(() => ({ wordSelected: to })),

      setPolytanPartUnlocked: (bodyPart: string) =>
        set((state) => ({
          polytanUnlockedParts: {
            ...state.polytanUnlockedParts,
            [bodyPart]: true,
          },
        })),

      setInputCooldown: (to: number) => set(() => ({ inputCooldown: to })),

      incrementGateLvl: () =>
        set((state) => ({
          gameProgress: {
            ...state.gameProgress,
            gate_level: state.gameProgress.gate_level + 1,
          },
        })),
    })
  )
);

type PromptContext = {
  activePromptComponent: PromptComponent;
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
  activeNode: NodeData;
  showingAbout: boolean;
  level: number;
  activePauseComponent: PauseComponent;
  gameProgress: GameProgress;
  subscene: string;
  siteRotY: number;
  activeSite: ActiveSite;
  selectedLevel: number;
  wordNotFound: boolean;
  siteSaveState: SiteSaveState;
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
    showingAbout: state.showingAbout,
    siteSaveState: state.siteSaveState,
    wordNotFound: state.wordNotFound,
  };
};

export type SsknSceneContext = {
  keyPress: string;
  activeSsknComponent: SsknComponent;
  activeNode: NodeData;
  gameProgress: GameProgress;
};

export const getSsknSceneContext = (keyPress: string): SsknSceneContext => {
  const state = useStore.getState();
  return {
    keyPress: keyPress,
    activeSsknComponent: state.activeSsknComponent,
    activeNode: state.activeNode,
    gameProgress: state.gameProgress,
  };
};

export type MediaSceneContext = {
  keyPress: string;
  wordPosStateIdx: number;
  currentMediaSide: MediaSide;
  activeMediaComponent: MediaComponent;
  activeNode: NodeData;
  gameProgress: GameProgress;
  lastActiveMediaComponents: {
    left: LeftMediaComponent;
    right: RightMediaComponent;
  };
  activeSite: ActiveSite;
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
  subscene: BootSubscene;
  activeMainMenuComponent: MainMenuComponent;
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
  activeEndComponent: EndComponent;
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
