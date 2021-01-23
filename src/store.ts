import create from "zustand";
import { combine } from "zustand/middleware";
import * as THREE from "three";
import authorize_user_letters from "./resources/authorize_user_letters.json";
import game_progress from "./resources/initial_progress.json";
import { HUDType } from "./components/MainScene/SyncedComponents/HUD";
import { NodeDataType } from "./components/MainScene/SyncedComponents/Site";

type EndState = {
  mediaPlayedCount: number;
  incrementMediaPlayedCount: () => void;
  resetMediaPlayedCount: () => void;
};

type IdleState = {
  media: any;
  images: any;
  setMedia: (to: any) => void;
  setImages: (to: any) => void;
};

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

type SceneState = {
  currentScene: string;
  setScene: (to: string) => void;
};

type MediaWordState = {
  posStateIdx: number;
  setPosStateIdx: (to: number) => void;
  resetPosStateIdx: () => void;
};

export type BigTextState = {
  visible: boolean;
  disableTrail: boolean;
  text: string;
  color: string;
  transformState: {
    posX: number;
    posY: number;
    xOffset: number;
  };
};

export type MediaState = {
  audioAnalyser: any;
  mediaPercentageElapsed: number;
  componentMatrix: [[string, string], [string, string, string]];
  componentMatrixIndices: {
    sideIdx: number;
    leftSideIdx: number;
    rightSideIdx: number;
  };
};

export type BootState = {
  componentMatrix: {
    main_menu: [string, string];
    load_data: [string, string];
    authorize_user: number[];
  };
  componentMatrixIndices: {
    // 0 or 1
    main_menu: number;
    // 0 or 1
    load_data: number;
    authorize_user: number;
  };
  subscene: string;
};

export type AuthorizeUserState = {
  bgLettersPos: {
    x: number;
    y: number;
  };
  activeLetterTextureOffset: {
    x: number;
    y: number;
  };
  setBgLettersPos: (to: { x: number; y: number }) => void;
  setActiveLetterTexOffset: (to: { x: number; y: number }) => void;
};

export type GreenTextState = {
  text: string;
  transformState: {
    posX: { initial: number; final: number };
    posY: number;
    xOffset: number;
  };
  active: number;
};

type GateState = {
  gateLvl: number;
  incrementGateLvl: () => void;
};

type SSknState = {
  componentMatrix: string[];
  componentMatrixIdx: number;
  toggleComponentMatrixIdx: () => void;
  resetComponentMatrixIdx: () => void;
  loading: boolean;
  toggleLoading: () => void;
};

export type MediaBigTextState = {
  text: string;
  transformState: {
    posX: number;
    posY: number;
    xOffset: number;
  };
};

export const useMediaBigTextStore = create(
  combine(
    {
      transformState: {
        posX: -0.8,
        posY: 0.05,
        xOffset: 0,
      },
      text: "Play",
    } as MediaBigTextState,
    (set) => ({
      setText: (to: string) => set(() => ({ text: to })),
      setTransformState: (to: number, at: string) =>
        set((state) => ({
          transformState: { ...state.transformState, [at]: to },
        })),
    })
  )
);

export const useIdleStore = create<IdleState>((set) => ({
  media: "INS01.STR",
  // this may be undefined depending on whether or not the media is audio or not
  images: undefined,
  setMedia: (to) => set(() => ({ media: to })),
  setImages: (to) => set(() => ({ images: to })),
}));

export const useMediaWordStore = create<MediaWordState>((set) => ({
  posStateIdx: 1,
  setPosStateIdx: (to) => set(() => ({ posStateIdx: to })),
  resetPosStateIdx: () => set(() => ({ posStateIdx: 1 })),
}));

export const useSSknStore = create<SSknState>((set) => ({
  componentMatrix: ["sskn_ok", "sskn_cancel"],
  componentMatrixIdx: 0,
  loading: false,
  toggleComponentMatrixIdx: () =>
    set((state) => ({ componentMatrixIdx: Number(!state.componentMatrixIdx) })),
  resetComponentMatrixIdx: () => set(() => ({ componentMatrixIdx: 0 })),
  toggleLoading: () => set(() => ({ loading: true })),
}));

export const useSceneStore = create<SceneState>((set) => ({
  currentScene: "media",
  setScene: (to) => set(() => ({ currentScene: to })),
}));

export const useAuthorizeUserStore = create<AuthorizeUserState>((set) => ({
  bgLettersPos: {
    x: 3.35,
    y: -0.7,
  },
  activeLetterTextureOffset: {
    x: 0,
    y: -0.2,
  },
  setBgLettersPos: (to: { x: number; y: number }) =>
    set(() => ({ bgLettersPos: to })),
  setActiveLetterTexOffset: (to: { x: number; y: number }) =>
    set(() => ({ activeLetterTextureOffset: to })),
}));

type MainSceneState = {
  gameProgress: typeof game_progress;

  subscene: string;

  intro: boolean;

  bigText: string;
  bigTextVisible: boolean;
  bigTextColor: "yellow" | "orange";
  bigTextPos: number[];
  bigTextXOffset: 0 | -1;

  hud: HUDType;
  hudActive: boolean;

  activeNode: NodeDataType;

  activeNodeMatrixIndices: {
    matrixIdx: number;
    rowIdx: number;
    colIdx: number;
  };
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
  levelSelectionToggled: boolean;

  // pause
  pauseComponentMatrix: [string, string, string, string, string];
  pauseComponentMatrixIdx: number;
  pauseExitAnimation: boolean;

  // media/media scene
  audioAnalyser: undefined | THREE.AudioAnalyser;
  mediaPercentageElapsed: number;
  mediaComponentMatrix: [[string, string], [string, string, string]];
  mediaComponentMatrixIndices: {
    sideIdx: 0 | 1;
    leftSideIdx: 0 | 1;
    rightSideIdx: 0 | 1 | 2;
  };
};

export const useMainSceneStore = create(
  combine(
    {
      // game progress
      gameProgress: game_progress,

      // subscene
      subscene: "site",

      // whether or not to play the intro anim
      intro: true,

      // big text (the one that displays node names)
      bigText: "Tda028",
      bigTextVisible: true,
      bigTextColor: "yellow",
      bigTextPos: [-0.35, 0.23, -8.7],
      bigTextXOffset: 0,

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
      },
      activeNodeMatrixIndices: { matrixIdx: 7, rowIdx: 0, colIdx: 0 },
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
    } as MainSceneState,
    (set) => ({
      // subscene setters
      setSubscene: (to: string) => set(() => ({ subscene: to })),

      // intro setters
      setIntro: (to: boolean) => set(() => ({ intro: to })),

      // big text setters
      setBigText: (to: string) => set(() => ({ bigText: to })),
      setBigTextVisible: (to: boolean) => set(() => ({ bigTextVisible: to })),
      setBigTextColor: (to: "yellow" | "orange") =>
        set(() => ({ bigTextColor: to })),
      setBigTextPos: (to: number[]) => set(() => ({ bigTextPos: to })),
      setBigTextXOffset: (to: 0 | -1) => set(() => ({ bigTextXOffset: to })),

      // hud setters
      setHud: (to: HUDType) => set(() => ({ hud: to })),
      toggleHudActive: () => set((state) => ({ hudActive: !state.hudActive })),

      // node setters
      setNode: (to: NodeDataType) => set(() => ({ activeNode: to })),
      setNodeMatrixIndices: (to: {
        matrixIdx: number;
        rowIdx: number;
        colIdx: number;
      }) => set(() => ({ activeNodeMatrixIndices: to })),
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
    })
  )
);

export const useBootStore = create(
  combine(
    {
      componentMatrix: {
        main_menu: ["authorize_user", "load_data"],
        load_data: ["load_data_yes", "load_data_no"],
        authorize_user: authorize_user_letters.letters,
      },
      componentMatrixIndices: {
        // 0 or 1
        main_menu: 0,
        // 0 or 1
        load_data: 0,
        authorize_user: 0,
      },
      // main_menu, load_data or authorize_user
      subscene: "main_menu",
    } as BootState,
    (set) => ({
      setSubscene: (to: string) => set(() => ({ subscene: to })),
      toggleComponentMatrixIdx: (subscene: string) =>
        set((state) => ({
          componentMatrixIndices: {
            ...state.componentMatrixIndices,
            [subscene]: Number(
              !state.componentMatrixIndices[
                subscene as keyof typeof state.componentMatrixIndices
              ]
            ),
          },
        })),
      setAuthorizeUserMatrixIdx: (to: number) =>
        set((state) => ({
          componentMatrixIndices: {
            ...state.componentMatrixIndices,
            authorize_user: to,
          },
        })),
    })
  )
);

export const usePolytanStore = create<any>((set) => ({
  unlockedParts: {
    body: true,
    head: false,
    leftArm: false,
    rightArm: false,
    leftLeg: false,
    rightLeg: false,
  },
}));

export const useGateStore = create<GateState>((set) => ({
  gateLvl: 4,
  incrementGateLvl: () => set((state) => ({ gateLvl: state.gateLvl + 1 })),
}));

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

export const useEndSceneStore = create<EndState>((set) => ({
  mediaPlayedCount: 0,
  incrementMediaPlayedCount: () =>
    set((state) => ({ mediaPlayedCount: state.mediaPlayedCount + 1 })),
  resetMediaPlayedCount: () => set(() => ({ mediaPlayedCount: 0 })),
}));

export const getMainSceneContext = () =>
  useMainSceneStore.getState().activeNode;
