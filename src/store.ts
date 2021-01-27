import create from "zustand";
import { combine } from "zustand/middleware";
import * as THREE from "three";
import authorize_user_letters from "./resources/authorize_user_letters.json";
import game_progress from "./resources/initial_progress.json";
import { HUDType } from "./components/MainScene/SyncedComponents/HUD";
import { NodeDataType } from "./components/MainScene/SyncedComponents/Site";

type SiteSaveState = {
  a: {
    activeNodeId: string;
    nodeMatrixIndices: { matrixIdx: number; rowIdx: number; colIdx: number };
    nodeHudId: string;
    siteRotY: number;
    sitePosY: number;
    level: string;
  };
  b: {
    activeNodeId: string;
    nodeMatrixIndices: { matrixIdx: number; rowIdx: number; colIdx: number };
    nodeHudId: string;
    siteRotY: number;
    sitePosY: number;
    level: string;
  };
};

type State = {
  currentScene: string;

  gameProgress: typeof game_progress;

  mainSubscene: string;

  intro: boolean;

  hud: HUDType;
  hudActive: boolean;

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
  sitePos: number[];

  // middle ring
  middleRingPos: number[];
  middleRingRot: number[];
  middleRingWobbleAmp: number;
  middleRingNoiseAmp: number;
  middleRingPartSeparatorVal: number;
  middleRingRotating: boolean;
  fakeMiddleRingVisible: boolean;

  // level
  activeLevel: string;

  // level selection
  selectedLevel: number;

  // pause
  pauseComponentMatrix: ["load", "about", "change", "save", "exit"];
  pauseComponentMatrixIdx: number;
  pauseExitAnimation: boolean;

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

  // idle scene
  idleMedia: string;
  idleImages: any;

  // sskn scene
  ssknComponentMatrix: ["sskn_ok", "sskn_cancel"];
  ssknComponentMatrixIdx: 0 | 1;
  ssknLoading: boolean;

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

  // boot scene
  bootComponentMatrix: {
    main_menu: ["authorize_user", "load_data"];
    load_data: ["load_data_yes", "load_data_no"];
    authorize_user: typeof authorize_user_letters.letters;
  };
  bootComponentMatrixIndices: {
    // 0 or 1
    main_menu: 0 | 1;
    // 0 or 1
    load_data: 0 | 1;
    authorize_user: 0;
  };
  bootSubscene: "main_menu" | "load_data" | "authorize_user";

  // end scene
  endMediaPlayedCount: number;
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

      // whether or not to play the intro anim
      intro: true,

      // hud
      hud: {
        mirrored: 0,
        long: {
          position: [-0.45, 0.15, -8.6],
          initial_position: [-1.45, 0.15, -8.6],
        },
        boring: {
          position: [0.48, 0.174, -8.6],
          initial_position: [1.48, 0.174, -8.6],
        },
        big: {
          position: [0.36, 0.13, -8.6],
          initial_position: [1.36, 0.13, -8.6],
        },
        big_text: [-0.35, 0.23, -8.7],
        medium_text: {
          position: [0.18, 0.16, -8.7],
          initial_position: [1.18, 0.16, -8.7],
        },
      },
      hudActive: true,

      // nodes
      activeNode: {
        id: "0422",
        image_table_indices: {
          "1": "93",
          "2": "356",
          "3": "562",
        },
        media_file: "LAIN08.XA[26]",
        node_name: "Tda028",
        protocol_lines: {
          "1": "TOUKO's_DIARY",
          "2": "authorized_il",
          "3": "decoded file:t",
          "4": "ftp/tl.S_server",
        },
        required_final_video_viewcount: 0,
        site: "A",
        title: "TOUKO's DIARY",
        triggers_final_video: 0,
        type: 2,
        unlocked_by: "",
        upgrade_requirement: 0,
        words: {
          "1": "eye",
          "2": "quiet",
          "3": "hallucination",
        },
        matrixIndices: { matrixIdx: 7, rowIdx: 0, colIdx: 0 },
      },
      activeNodePos: [0, 0, 0],
      activeNodeRot: [0, 0, 0],
      activeNodeState: {
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
      sitePos: [0, 0, 0],

      // middle ring
      middleRingPos: [0, -0.11, 0],
      middleRingRot: [0, 0, 0],
      middleRingWobbleAmp: 0,
      middleRingNoiseAmp: 0,
      middleRingPartSeparatorVal: 1,
      middleRingRotating: true,
      fakeMiddleRingVisible: false,

      // level
      activeLevel: "04",

      // level selection
      selectedLevel: 4,

      // pause
      pauseComponentMatrix: ["load", "about", "change", "save", "exit"],
      pauseComponentMatrixIdx: 2,
      pauseExitAnimation: false,

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

      // idle scene
      idleMedia: "INS01.STR",
      // this may be undefined depending on whether or not the media is audio or not
      idleImages: undefined,

      // sskn scene
      ssknComponentMatrix: ["sskn_ok", "sskn_cancel"],
      ssknComponentMatrixIdx: 0,
      ssknLoading: false,

      // polytan scene
      polytanUnlockedParts: {
        body: true,
        head: false,
        leftArm: false,
        rightArm: false,
        leftLeg: false,
        rightLeg: false,
      },

      // gate scene
      gateLvl: 4,

      // boot scene
      bootComponentMatrix: {
        main_menu: ["authorize_user", "load_data"],
        load_data: ["load_data_yes", "load_data_no"],
        authorize_user: authorize_user_letters.letters,
      },
      bootComponentMatrixIndices: {
        // 0 or 1
        main_menu: 0,
        // 0 or 1
        load_data: 0,
        authorize_user: 0,
      },
      bootSubscene: "main_menu",

      // end scene
      endMediaPlayedCount: 0,
    } as State,
    (set) => ({
      // scene data setters
      setScene: (to: string) => set(() => ({ currentScene: to })),

      // main subscene setter
      setMainSubscene: (to: string) => set(() => ({ mainSubscene: to })),

      // intro setters
      setIntro: (to: boolean) => set(() => ({ intro: to })),

      // hud setters
      setHud: (to: HUDType) => set(() => ({ hud: to })),
      toggleHudActive: () => set((state) => ({ hudActive: !state.hudActive })),

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
      setSiteRot: (to: number[]) => set(() => ({ siteRot: to })),
      setSiteRotX: (to: number) =>
        set((prev) => {
          const nextPos = [...prev.siteRot];
          nextPos[0] = to;
          return { siteRot: nextPos };
        }),
      setSitePos: (to: number[]) => set(() => ({ sitePos: to })),

      // middle ring setters
      setMiddleRingPos: (to: number[]) => set(() => ({ middleRingPos: to })),
      setMiddleRingRot: (to: number[]) => set(() => ({ middleRingRot: to })),
      setMiddleRingWobbleAmp: (to: number) =>
        set(() => ({ middleRingWobbleAmp: to })),
      setMiddleRingNoiseAmp: (to: number) =>
        set(() => ({ middleRingNoiseAmp: to })),
      setMiddleRingPartSeparatorVal: (to: number) =>
        set(() => ({ middleRingPartSeparatorVal: to })),
      setMiddleRingRotating: (to: boolean) =>
        set(() => ({ middleRingRotating: to })),
      setFakeMiddleRingVisible: (to: boolean) =>
        set(() => ({ fakeMiddleRingVisible: to })),

      // level setters
      setActiveLevel: (to: string) => set(() => ({ activeLevel: to })),

      // level selection setters
      setSelectedLevel: (to: number) => set(() => ({ selectedLevel: to })),

      // pause setters
      setPauseComponentMatrixIdx: (to: number) =>
        set(() => ({ pauseComponentMatrixIdx: to })),
      setPauseExitAnimation: (to: boolean) =>
        set(() => ({ pauseExitAnimation: to })),

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
      setMediaRightComponentMatrixIdx: (to: 0 | 1 | 2) =>
        set((state) => ({
          mediaComponentMatrixIndices: {
            ...state.mediaComponentMatrixIndices,
            rightSideIdx: to,
          },
        })),
      resetMediaComponentMatrixIndices: () =>
        set(() => ({
          mediaComponentMatrixIndices: {
            sideIdx: 0,
            leftSideIdx: 0,
            rightSideIdx: 0,
          },
        })),
      setPercentageElapsed: (to: number) =>
        set(() => ({ mediaPercentageElapsed: to })),
      setAudioAnalyser: (to: THREE.AudioAnalyser) =>
        set(() => ({ audioAnalyser: to })),
      setMediaWordPosStateIdx: (to: number) =>
        set(() => ({ mediaWordPosStateIdx: to })),
      resetMediaWordPosStateIdx: () => set(() => ({ mediaWordPosStateIdx: 1 })),

      // idle media setters
      setIdleMedia: (to: any) => set(() => ({ idleMedia: to })),
      setIdleImages: (to: any) => set(() => ({ idleImages: to })),

      // sskn scene setters
      toggleSSknComponentMatrixIdx: () =>
        set((state) => ({
          ssknComponentMatrixIdx: Number(!state.ssknComponentMatrixIdx) as
            | 0
            | 1,
        })),
      resetSSknComponentMatrixIdx: () =>
        set(() => ({ ssknComponentMatrixIdx: 0 })),
      setSSknLoading: (to: boolean) => set(() => ({ ssknLoading: to })),

      // gate scene setters
      incrementGateLvl: () => set((state) => ({ gateLvl: state.gateLvl + 1 })),

      // boot scene setters
      setBootSubscene: (to: "load_data" | "authorize_user" | "main_menu") =>
        set(() => ({ bootSubscene: to })),
      toggleBootComponentMatrixIdx: (subscene: "load_data" | "main_menu") =>
        set((state) => ({
          bootComponentMatrixIndices: {
            ...state.bootComponentMatrixIndices,
            [subscene]: Number(
              !state.bootComponentMatrixIndices[
                subscene as keyof typeof state.bootComponentMatrixIndices
              ]
            ),
          },
        })),

      // end scene setters
      incrementEndMediaPlayedCount: () =>
        set((state) => ({
          endMediaPlayedCount: state.endMediaPlayedCount + 1,
        })),
      resetEndMediaPlayedCount: () => set(() => ({ endMediaPlayedCount: 0 })),
    })
  )
);

export const useSiteSaveStore = create(
  combine(
    {
      a: {
        activeNodeId: "0422",
        nodeMatrixIndices: { matrixIdx: 7, rowIdx: 0, colIdx: 0 },
        nodeHudId: "fg_hud_1",
        siteRotY: 0,
        sitePosY: 0,
        level: "04",
      },
      b: {
        activeNodeId: "0414",
        nodeMatrixIndices: { matrixIdx: 7, rowIdx: 1, colIdx: 0 },
        nodeHudId: "fg_hud_2",
        siteRotY: 0,
        sitePosY: 0,
        level: "04",
      },
    } as SiteSaveState,
    (set) => ({
      setSiteSaveState: (
        site: string,
        to: {
          activeNodeId: string;
          nodeMatrixIndices: {
            matrixIdx: number;
            rowIdx: number;
            colIdx: number;
          };
          nodeHudId: string;
          siteRotY: number;
          sitePosY: number;
          level: string;
        }
      ) => set(() => ({ [site]: to })),
    })
  )
);

export const getMainSceneContext = () => useStore.getState().activeNode;
