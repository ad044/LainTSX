import create from "zustand";
import { combine } from "zustand/middleware";
import * as THREE from "three";
import site_a from "./resources/site_a.json";
import site_b from "./resources/site_b.json";
import authorize_user_letters from "./resources/authorize_user_letters.json";
import game_progress from "./resources/initial_progress.json";
import { HUDType } from "./components/MainScene/SyncedComponents/HUD";

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

type PauseState = {
  exitAnimation: boolean;
  componentMatrix: string[];
  componentMatrixIdx: number;
  setComponentMatrixIdx: (to: number) => void;
  setExitAnimation: (to: boolean) => void;
};

type LevelSelectionState = {
  selectedLevel: number;
  levelSelectionToggled: number;
  setSelectedLevel: (to: number) => void;
  toggleLevelSelection: () => void;
};

type SceneState = {
  currentScene: string;
  setScene: (to: string) => void;
};

type HUDState = {
  id: string;
  active: number;
  setId: (to: string) => void;
  toggleActive: () => void;
};

type NodeState = {
  activeNodeState: {
    id: string;
    posX: number;
    posZ: number;
    posY: number;
    rotZ: number;
    interactedWith: boolean;
    exploding: boolean;
    shrinking: boolean;
    visible: boolean;
  };
  nodeMatrixIndices: { matrixIdx: number; rowIdx: number; colIdx: number };
  gameProgress: typeof game_progress;
};

type LainState = {
  lainMoveState: string;
  setLainMoveState: (to: string) => void;
};

type SiteState = {
  currentSite: "a" | "b";
  transformState: {
    posY: number;
    rotY: number;
    rotX: number;
  };
};

type LevelState = {
  activeLevel: string;
  setActiveLevel: (to: string) => void;
};

type MiddleRingState = {
  transformState: {
    wobbleStrength: number;
    noiseStrength: number;
    posY: number;
    rotX: number;
    rotZ: number;
  };
  isRotating: boolean;
  animDuration: number;
  mainRingVisible: boolean;
  partSeparatorVal: number;
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

type MainSceneState = {
  intro: boolean;
  subscene: string;
  setSubscene: (to: string) => void;
  setIntro: (to: boolean) => void;
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

export const useSiteStore = create(
  combine(
    {
      currentSite: "a",
      transformState: {
        posY: 0,
        rotY: 0,
        rotX: 0,
      },
    } as SiteState,
    (set) => ({
      setTransformState: (to: number, at: string) =>
        set((state) => ({
          transformState: { ...state.transformState, [at]: to },
        })),
      setCurrentSite: (to: string) =>
        set(() => ({ currentSite: to as "a" | "b" })),
    })
  )
);

export const useMiddleRingStore = create(
  combine(
    {
      transformState: {
        wobbleStrength: 0,
        noiseStrength: 0,
        posY: -0.11,
        rotX: 0,
        rotZ: 0,
      },
      partSeparatorVal: 1,
      isRotating: true,
      animDuration: 600,
      mainRingVisible: true,
    } as MiddleRingState,
    (set) => ({
      setTransformState: (to: number, at: string) =>
        set((state) => ({
          transformState: { ...state.transformState, [at]: to },
        })),
      setRotating: (to: boolean) => set(() => ({ isRotating: to })),
      setAnimDuration: (to: number) => set(() => ({ animDuration: to })),
      setMainRingVisible: (to: boolean) => set(() => ({ mainRingVisible: to })),
      setPartSeparatorVal: (to: number) =>
        set(() => ({ partSeparatorVal: to })),
    })
  )
);

export const useLevelStore = create<LevelState>((set) => ({
  activeLevel: "04",
  setActiveLevel: (to) => set(() => ({ activeLevel: to })),
}));

export const useMediaStore = create(
  combine(
    {
      audioAnalyser: undefined,
      mediaPercentageElapsed: 0,
      componentMatrix: [
        ["play", "exit"],
        ["fstWord", "sndWord", "thirdWord"],
      ],
      componentMatrixIndices: {
        // 0 or 1 (left/right)
        sideIdx: 0,
        // 0 or 1 ("play" or "exit")
        leftSideIdx: 0,
        // 0 or 1 or 2 ("fstWord", "sndWord" or "thirdWord")
        rightSideIdx: 0,
      },
    } as MediaState,
    (set) => ({
      toggleSide: () =>
        set((state) => ({
          componentMatrixIndices: {
            ...state.componentMatrixIndices,
            sideIdx: Number(!state.componentMatrixIndices.sideIdx),
          },
        })),
      setLeftComponentMatrixIdx: (to: number) =>
        set((state) => ({
          componentMatrixIndices: {
            ...state.componentMatrixIndices,
            leftSideIdx: to,
          },
        })),
      setRightComponentMatrixIdx: (to: number) =>
        set((state) => ({
          componentMatrixIndices: {
            ...state.componentMatrixIndices,
            rightSideIdx: to,
          },
        })),
      resetComponentMatrixIndices: () =>
        set(() => ({
          componentMatrixIndices: {
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
  currentScene: "main",
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
      bigTextPos: [-0.35, 0.23, 0],
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
      hudActive: 1,

      // nodes
      activeNode: {
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
      middleRingAnimDuration: 600,
      middleRingRotating: true,
      fakeMiddleRingVisible: false,

      // level
      activeLevel: "04",

      // level selection
      selectedLevel: 4,
      levelSelectionToggled: 0,

      // pause
      pauseComponentMatrix: ["load", "about", "change", "save", "exit"],
      pauseComponentMatrixIdx: 2,
      pauseExitAnimation: false,
    } as any,
    (set) => ({
      // subscene setters
      setSubscene: (to: "pause" | "level_selection") =>
        set(() => ({ subscene: to })),

      // intro setters
      setIntro: (to: boolean) => set(() => ({ intro: to })),

      // big text setters
      setBigText: (to: string) => set(() => ({ bigText: to })),
      setBigTextVisible: (to: boolean) => set(() => ({ bigTextVisible: to })),
      setBigTextColor: (to: "yellow" | "orange") =>
        set(() => ({ bigTextColor: to })),
      setBigTextPos: (to: number[]) => set(() => ({ bigTextPos: to })),
      setBigTextXOffset: (to: number) => set(() => ({ bigTextXOffset: to })),

      // hud setters
      setHud: (to: HUDType) => set(() => ({ hud: to })),
      toggleHudActive: () =>
        set((state) => ({ hudActive: Number(!state.hudActive) })),

      // node setters
      setNode: (to: string) => set(() => ({ activeNode: to })),
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
      toggleLevelSelection: () =>
        set((state) => ({
          levelSelectionToggled: Number(!state.levelSelectionToggled),
        })),

      // pause setters
      setPauseComponentMatrixIdx: (to: number) =>
        set(() => ({ pauseComponentMatrixIdx: to })),
      setPauseExitAnimation: (to: boolean) =>
        set(() => ({ pauseExitAnimation: to })),
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

export const useLevelSelectionStore = create<LevelSelectionState>((set) => ({
  selectedLevel: 4,
  levelSelectionToggled: 0,
  setSelectedLevel: (to) => set(() => ({ selectedLevel: to })),
  toggleLevelSelection: () =>
    set((state) => ({
      levelSelectionToggled: Number(!state.levelSelectionToggled),
    })),
}));

export const usePauseStore = create<PauseState>((set) => ({
  componentMatrix: ["load", "about", "change", "save", "exit"],
  componentMatrixIdx: 2,
  exitAnimation: false,
  setComponentMatrixIdx: (to) => set(() => ({ componentMatrixIdx: to })),
  setExitAnimation: (to) => set(() => ({ exitAnimation: to })),
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
