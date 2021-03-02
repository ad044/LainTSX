import create from "zustand";
import { combine } from "zustand/middleware";
import * as THREE from "three";
import { AudioAnalyser } from "three";
import game_progress from "./resources/initial_progress.json";
import { getNodeById } from "./helpers/node-helpers";
import site_a from "./resources/site_a.json";
import {
  ActiveSite,
  AuthorizeUserMatrixIndices,
  BootSceneContext,
  BootSubscene,
  EndComponent,
  EndSceneContext,
  GameProgress,
  GameScene,
  LeftMediaComponent,
  MainMenuComponent,
  MainSceneContext,
  MainSubscene,
  MediaComponent,
  MediaSceneContext,
  MediaSide,
  NodeAttributes,
  NodeData,
  PauseComponent,
  PolytanBodyParts,
  PromptComponent,
  RightMediaComponent,
  SiteSaveState,
  SsknComponent,
  SsknSceneContext,
  UserSaveState,
} from "./types/types";

type State = {
  currentScene: GameScene;

  gameProgress: GameProgress;

  mainSubscene: MainSubscene;

  intro: boolean;

  activeNode: NodeData;
  activeNodePos: number[];
  activeNodeRot: number[];
  activeNodeAttributes: NodeAttributes;

  lainMoveState: string;
  canLainMove: boolean;

  activeSite: ActiveSite;
  siteRot: number[];
  oldSiteRot: number[];

  activeLevel: string;
  oldLevel: string;

  selectedLevel: number;

  activeEndComponent: EndComponent;
  endSceneSelectionVisible: boolean;

  activePauseComponent: PauseComponent;
  pauseExitAnimation: boolean;
  showingAbout: boolean;
  permissionDenied: boolean;

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

  idleStarting: boolean;
  idleMedia: string;
  idleImages: { "1": string; "2": string; "3": string } | undefined;
  idleNodeName: string | undefined;

  activeSsknComponent: SsknComponent;
  ssknLoading: boolean;

  polytanUnlockedParts: PolytanBodyParts;

  playerName: string;

  activeMainMenuComponent: MainMenuComponent;
  authorizeUserMatrixIndices: AuthorizeUserMatrixIndices;
  bootSubscene: BootSubscene;

  promptVisible: boolean;
  activePromptComponent: PromptComponent;

  loadSuccessful: boolean | undefined;
  saveSuccessful: boolean | undefined;

  wordNotFound: boolean;

  siteSaveState: SiteSaveState;

  inputCooldown: number;
};

export const useStore = create(
  combine(
    {
      // scene data
      currentScene: "boot",

      // game progress
      gameProgress: game_progress,

      // main subscene
      mainSubscene: "site",

      // whether or not to play the intro anim on main scene
      intro: true,

      // nodes
      activeNode: {
        ...site_a["04"]["0414"],
        matrixIndices: { matrixIdx: 7, rowIdx: 1, colIdx: 0 },
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
      canLainMove: true,

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
      authorizeUserMatrixIndices: {
        rowIdx: 0,
        colIdx: 0,
      },
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
            ...getNodeById("0408", "a"),
            matrixIndices: { matrixIdx: 7, rowIdx: 1, colIdx: 0 },
          },
          siteRot: [0, 0, 0],
          activeLevel: "04",
        },
        b: {
          activeNode: {
            ...getNodeById("0105", "b"),
            matrixIndices: { matrixIdx: 6, rowIdx: 2, colIdx: 0 },
          },
          siteRot: [0, 0 - Math.PI / 4, 0],
          activeLevel: "01",
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
        set((state) => {
          const nodes = { ...state.gameProgress.nodes, [nodeName]: to };
          return {
            gameProgress: {
              ...state.gameProgress,
              nodes: nodes,
            },
          };
        }),

      resetMediaScene: () =>
        set(() => ({
          activeMediaComponent: "play",
          currentMediaSide: "left",
          mediaWordPosStateIdx: 1,
        })),

      incrementFinalVideoViewCount: () =>
        set((state) => ({
          gameProgress: {
            ...state.gameProgress,
            final_video_viewcount: state.gameProgress.final_video_viewcount + 1,
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

      loadUserSaveState: (userState: UserSaveState) =>
        set(() => ({
          siteSaveState: userState.siteSaveState,
          activeNode: userState.activeNode,
          siteRot: userState.siteRot,
          activeLevel: userState.activeLevel,
          activeSite: userState.activeSite,
          gameProgress: userState.gameProgress,
        })),
    })
  )
);

const getPromptContext = () => {
  const state = useStore.getState();

  return {
    promptVisible: state.promptVisible,
    activePromptComponent: state.activePromptComponent,
  };
};

export const getMainSceneContext = (): MainSceneContext => {
  const state = useStore.getState();

  return {
    ...getPromptContext(),
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
    canLainMove: state.canLainMove,
  };
};

export const getSsknSceneContext = (): SsknSceneContext => {
  const state = useStore.getState();
  return {
    activeSsknComponent: state.activeSsknComponent,
    activeNode: state.activeNode,
  };
};

export const getMediaSceneContext = (): MediaSceneContext => {
  const state = useStore.getState();

  return {
    lastActiveMediaComponents: state.lastActiveMediaComponents,
    currentMediaSide: state.currentMediaSide,
    activeMediaComponent: state.activeMediaComponent,
    wordPosStateIdx: state.mediaWordPosStateIdx,
    activeNode: state.activeNode,
    activeSite: state.activeSite,
    gameProgress: state.gameProgress,
  };
};

export const getBootSceneContext = (): BootSceneContext => {
  const state = useStore.getState();

  return {
    ...getPromptContext(),
    playerName: state.playerName,
    subscene: state.bootSubscene,
    activeMainMenuComponent: state.activeMainMenuComponent,
    authorizeUserMatrixIndices: state.authorizeUserMatrixIndices,
  };
};

export const getEndSceneContext = (): EndSceneContext => {
  const state = useStore.getState();

  return {
    activeEndComponent: state.activeEndComponent,
    selectionVisible: state.endSceneSelectionVisible,
    siteSaveState: state.siteSaveState,
    activeNode: state.activeNode,
    siteRot: state.siteRot,
    activeLevel: state.activeLevel,
  };
};

export const getCurrentUserState = (): UserSaveState => {
  const state = useStore.getState();

  return {
    siteSaveState: state.siteSaveState,
    activeNode: state.activeNode,
    siteRot: [0, state.siteRot[1], 0],
    activeLevel: state.activeLevel,
    activeSite: state.activeSite,
    gameProgress: state.gameProgress,
  };
};

export const saveUserProgress = (state: UserSaveState) =>
  localStorage.setItem("lainSaveState", JSON.stringify(state));

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
