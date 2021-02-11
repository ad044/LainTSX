import create from "zustand";
import { combine } from "zustand/middleware";
import * as THREE from "three";
import game_progress from "./resources/initial_progress.json";
import { NodeDataType } from "./components/MainScene/Site";
import { getNodeById } from "./utils/node-utils";
import site_a from "./resources/site_a.json";

type State = {
  currentScene: string;

  gameProgress: typeof game_progress;

  mainSubscene: string;

  intro: boolean;

  activeNode: NodeDataType;
  activeNodePos: number[];
  activeNodeRot: number[];
  activeNodeState: {
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

  // pause
  pauseComponentMatrix: ["load", "about", "change", "save", "exit"];
  pauseComponentMatrixIdx: number;
  pauseExitAnimation: boolean;
  showingAbout: boolean;
  permissionDenied: boolean;

  // media/media scene
  audioAnalyser: undefined | THREE.AudioAnalyser;
  mediaPercentageElapsed: number;
  mediaComponentMatrix: [["play", "exit"], ["fstWord", "sndWord", "thirdWord"]];
  mediaComponentMatrixIndices: {
    sideIdx: 0 | 1;
    leftSideIdx: 0 | 1;
    rightSideIdx: 0 | 1 | 2;
  };
  mediaWordPosStateIdx: number;
  wordSelected: boolean;

  // idle scene
  idleMedia: string;
  idleImages: any;

  // sskn scene
  ssknComponentMatrix: ["ok", "cancel"];
  ssknComponentMatrixIdx: 0 | 1;
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
  mainMenuComponentMatrix: ["authorize_user", "load_data"];
  mainMenuComponentMatrixIdx: 0 | 1;
  authorizeUserLetterIdx: number;
  bootSubscene: "main_menu" | "load_data" | "authorize_user";

  // end scene
  endMediaPlayedCount: number;

  // prompt
  promptVisible: boolean;
  promptComponentMatrix: ["yes", "no"];
  promptComponentMatrixIdx: 1 | 0;

  // status notifiers
  loadSuccessful: boolean | undefined;
  saveSuccessful: boolean | undefined;

  // save state
  siteSaveState: {
    a: {
      activeNode: NodeDataType;
      siteRot: number[];
      activeLevel: string;
    };
    b: {
      activeNode: NodeDataType;
      siteRot: number[];
      activeLevel: string;
    };
  };
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
      activeNode: site_a["17"]["1717"],

      // lain
      lainMoveState: "standing",

      // site
      activeSite: "a",
      siteRot: [0, 0, 0],
      // this one is used for word selection animation to start from the correct point
      oldSiteRot: [0, 0, 0],

      // level
      activeLevel: "04",
      // this one is used for word selection animation to start from the correct point
      oldLevel: "04",

      // level selection
      selectedLevel: 4,

      // pause
      pauseComponentMatrix: ["load", "about", "change", "save", "exit"],
      pauseComponentMatrixIdx: 2,
      pauseExitAnimation: false,
      showingAbout: false,
      permissionDenied: false,

      // media / media scene
      audioAnalyser: undefined,
      mediaPercentageElapsed: 0,
      mediaComponentMatrix: [
        ["play", "exit"],
        ["fstWord", "sndWord", "thirdWord"],
      ],
      mediaComponentMatrixIndices: {
        // 0 or 1 (left/right)
        sideIdx: 0,
        // 0 or 1 ("play" or "exit")
        leftSideIdx: 0,
        // 0 or 1 or 2 ("fstWord", "sndWord" or "thirdWord")
        rightSideIdx: 0,
      },
      mediaWordPosStateIdx: 1,
      wordSelected: false,

      // idle scene
      idleMedia: "INS01.STR",
      // this may be undefined depending on whether or not the media is audio or not
      idleImages: undefined,

      // sskn scene
      ssknComponentMatrix: ["ok", "cancel"],
      ssknComponentMatrixIdx: 0,
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
      playerName: "",

      // boot scene
      mainMenuComponentMatrix: ["authorize_user", "load_data"],
      mainMenuComponentMatrixIdx: 0,
      authorizeUserLetterIdx: 0,
      bootSubscene: "main_menu",

      // end scene
      endMediaPlayedCount: 0,

      // prompt
      promptVisible: false,
      promptComponentMatrix: ["yes", "no"],
      promptComponentMatrixIdx: 1,

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
    } as State,
    (set) => ({
      // scene data setters
      setScene: (to: string) => set(() => ({ currentScene: to })),

      // main subscene setter
      setMainSubscene: (to: string) => set(() => ({ mainSubscene: to })),

      // intro setters
      setIntro: (to: boolean) => set(() => ({ intro: to })),

      // node setters
      setNode: (to: NodeDataType) => set(() => ({ activeNode: to })),
      setNodePos: (to: number[]) => set(() => ({ activeNodePos: to })),
      setNodeRot: (to: number[]) => set(() => ({ activeNodeRot: to })),
      setNodeState: (
        to: boolean,
        at: "interactedWith" | "visible" | "exploding" | "shrinking"
      ) =>
        set((state) => ({
          activeNodeState: { ...state.activeNodeState, [at]: to },
        })),

      // lain setters
      setLainMoveState: (to: string) => set(() => ({ lainMoveState: to })),

      // site setters
      setActiveSite: (to: "a" | "b") => set(() => ({ activeSite: to })),
      setSiteRotY: (to: number) =>
        set((prev) => {
          const nextRot = [...prev.siteRot];
          nextRot[1] = to;
          return { siteRot: nextRot };
        }),
      setSiteRotX: (to: number) =>
        set((prev) => {
          const nextRot = [...prev.siteRot];
          nextRot[0] = to;
          return { siteRot: nextRot };
        }),
      setOldSiteRot: (to: number[]) =>
        set(() => ({
          oldSiteRot: to,
        })),

      // level setters
      setActiveLevel: (to: string) => set(() => ({ activeLevel: to })),
      setOldLevel: (to: string) => set(() => ({ oldLevel: to })),

      // level selection setters
      setSelectedLevel: (to: number) => set(() => ({ selectedLevel: to })),

      // pause setters
      setPauseComponentMatrixIdx: (to: number) =>
        set(() => ({ pauseComponentMatrixIdx: to })),
      setPauseExitAnimation: (to: boolean) =>
        set(() => ({ pauseExitAnimation: to })),
      setShowingAbout: (to: boolean) => set(() => ({ showingAbout: to })),
      setPermissionDenied: (to: boolean) =>
        set(() => ({ permissionDenied: to })),

      // media/media scene setters
      toggleMediaSide: () =>
        set((state) => ({
          mediaComponentMatrixIndices: {
            ...state.mediaComponentMatrixIndices,
            sideIdx: Number(!state.mediaComponentMatrixIndices.sideIdx) as
              | 0
              | 1,
          },
        })),
      setMediaLeftComponentMatrixIdx: (to: 0 | 1) =>
        set((state) => ({
          mediaComponentMatrixIndices: {
            ...state.mediaComponentMatrixIndices,
            leftSideIdx: to,
          },
        })),
      updateRightSide: (matrixIdx: 0 | 1 | 2, wordPosIdx: number) =>
        set((state) => ({
          mediaComponentMatrixIndices: {
            ...state.mediaComponentMatrixIndices,
            rightSideIdx: matrixIdx,
          },
          mediaWordPosStateIdx: wordPosIdx,
        })),
      setPercentageElapsed: (to: number) =>
        set(() => ({ mediaPercentageElapsed: to })),
      setAudioAnalyser: (to: THREE.AudioAnalyser) =>
        set(() => ({ audioAnalyser: to })),
      setWordSelected: (to: boolean) => set(() => ({ wordSelected: to })),

      // idle media setters
      setIdleMedia: (to: any) => set(() => ({ idleMedia: to })),
      setIdleImages: (to: any) => set(() => ({ idleImages: to })),

      //polytan setters
      setPolytanPartUnlocked: (bodyPart: string) =>
        set((state) => ({
          polytanUnlockedParts: {
            ...state.polytanUnlockedParts,
            [bodyPart]: true,
          },
        })),
      // sskn scene setters
      toggleSSknComponentMatrixIdx: () =>
        set((state) => ({
          ssknComponentMatrixIdx: Number(!state.ssknComponentMatrixIdx) as
            | 0
            | 1,
        })),
      setSSknLoading: (to: boolean) => set(() => ({ ssknLoading: to })),
      incrementSSknLvl: () => set((state) => ({ ssknLvl: state.ssknLvl + 1 })),

      // gate scene setters
      incrementGateLvl: () => set((state) => ({ gateLvl: state.gateLvl + 1 })),

      // player name setters
      setPlayerName: (to: string) => set(() => ({ playerName: to })),

      // boot scene setters
      setBootSubscene: (to: "load_data" | "authorize_user" | "main_menu") =>
        set(() => ({ bootSubscene: to })),
      setMainMenuComponentMatrixIdx: (to: 0 | 1) =>
        set(() => ({
          mainMenuComponentMatrixIdx: to,
        })),
      setAuthorizeUserLetterIdx: (to: number) =>
        set(() => ({ authorizeUserLetterIdx: to })),

      // end scene setters
      incrementEndMediaPlayedCount: () =>
        set((state) => ({
          endMediaPlayedCount: state.endMediaPlayedCount + 1,
        })),
      resetEndMediaPlayedCount: () => set(() => ({ endMediaPlayedCount: 0 })),

      // prompt setters
      setPromptVisible: (to: boolean) => set(() => ({ promptVisible: to })),
      setPromptComponentMatrixIdx: (to: 1 | 0) =>
        set(() => ({ promptComponentMatrixIdx: to })),

      // site state setters
      setSiteSaveState: (
        site: string,
        to: {
          activeNode: NodeDataType;
          siteRot: number[];
          activeLevel: string;
        }
      ) =>
        set((state) => ({
          siteSaveState: { ...state.siteSaveState, [site]: to },
        })),
      loadSiteSaveState: (site: "a" | "b") =>
        set((state) => {
          const stateToLoad = state.siteSaveState[site];
          return {
            activeSite: site,
            activeNode: stateToLoad.activeNode,
            siteRot: stateToLoad.siteRot,
            activeLevel: stateToLoad.activeLevel,
          };
        }),

      // status notifier setters
      setSaveSuccessful: (to: boolean | undefined) =>
        set(() => ({ saveSuccessful: to })),
      setLoadSuccessful: (to: boolean | undefined) =>
        set(() => ({ loadSuccessful: to })),

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
    })
  )
);

export const getSiteState = (site: "a" | "b") => {
  const siteState = useStore.getState().siteSaveState[site];

  return {
    activeNode: siteState.activeNode,
    siteRot: siteState.siteRot,
    activeLevel: siteState.activeLevel,
  };
};

const getPromptContext = () => {
  const state = useStore.getState();

  return {
    promptVisible: state.promptVisible,
    activePromptComponent:
      state.promptComponentMatrix[state.promptComponentMatrixIdx],
  };
};

export const getMainSceneContext = () => {
  const state = useStore.getState();

  return {
    ...getPromptContext(),
    subscene: state.mainSubscene,
    selectedLevel: state.selectedLevel,
    pauseMatrixIdx: state.pauseComponentMatrixIdx,
    activePauseComponent:
      state.pauseComponentMatrix[state.pauseComponentMatrixIdx],
    gameProgress: state.gameProgress,
    currentSite: state.activeSite,
    siteRotY: state.siteRot[1],
    activeNode: state.activeNode,
    level: parseInt(state.activeLevel),
    ssknLvl: state.ssknLvl,
    showingAbout: state.showingAbout,
    gateLvl: state.gateLvl,
  };
};

export const getSSknSceneContext = () => {
  const state = useStore.getState();
  return {
    activeSSknComponent:
      state.ssknComponentMatrix[state.ssknComponentMatrixIdx],
    activeNode: state.activeNode,
  };
};

export const getMediaSceneContext = () => {
  const state = useStore.getState();

  return {
    activeMediaComponent:
      state.mediaComponentMatrix[state.mediaComponentMatrixIndices.sideIdx][
        state.mediaComponentMatrixIndices.sideIdx === 0
          ? state.mediaComponentMatrixIndices.leftSideIdx
          : state.mediaComponentMatrixIndices.rightSideIdx
      ],
    rightSideComponentIdx: state.mediaComponentMatrixIndices.rightSideIdx,
    wordPosStateIdx: state.mediaWordPosStateIdx,
    activeNode: state.activeNode,
    activeSite: state.activeSite,
    gameProgress: state.gameProgress,
  };
};

export const getBootSceneContext = () => {
  const state = useStore.getState();

  return {
    ...getPromptContext(),
    playerName: state.playerName,
    subscene: state.bootSubscene,
    activeMainMenuComponent:
      state.mainMenuComponentMatrix[state.mainMenuComponentMatrixIdx],
    authorizeUserLetterIdx: state.authorizeUserLetterIdx,
  };
};

export const playAudio = (audio: HTMLAudioElement) => {
  audio.currentTime = 0;
  audio.currentTime = 0;
  audio.volume = 0.5;
  audio.loop = false;
  audio.play();
};
