import create from "zustand";
import { combine } from "zustand/middleware";
import * as THREE from "three";
import authorize_user_letters from "./resources/authorize_user_letters.json";
import game_progress from "./resources/initial_progress.json";

type EndState = {
  mediaPlayedCount: number;
  incrementMediaPlayedCount: () => void;
  resetMediaPlayedCount: () => void;
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

type StarfieldState = {
  introStarfieldVisible: boolean;
  mainStarfieldVisible: boolean;
  mainStarfieldBoostVal: number;
  setIntroStarfieldVisible: (to: boolean) => void;
  setMainStarfieldVisible: (to: boolean) => void;
  setMainStarfieldBoostVal: (to: number) => void;
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

export const useBigTextStore = create(
  combine(
    {
      visible: true,
      color: "yellow",
      disableTrail: false,
      text: "Tda028",
      transformState: {
        posX: -0.35,
        posY: 0.23,
        xOffset: 0,
      },
    } as BigTextState,
    (set) => ({
      setDisableTrail: (to: boolean) => set(() => ({ disableTrail: to })),
      setText: (to: string) => set(() => ({ text: to })),
      setTransformState: (to: number, at: string) =>
        set((state) => ({
          transformState: { ...state.transformState, [at]: to },
        })),
      addToTransformState: (val: number, at: string) =>
        set((state) => ({
          transformState: {
            ...state.transformState,
            [at]:
              state.transformState[at as keyof typeof state.transformState] +
              val,
          },
        })),
      setColor: (to: string) => set(() => ({ color: to })),
      setVisible: (to: boolean) => set(() => ({ visible: to })),
    })
  )
);

export const useGreenTextStore = create(
  combine(
    {
      text: "TOUKO's DIARY",
      transformState: {
        posX: { initial: 1.18, final: 0.18 },
        posY: 0.16,
        xOffset: 0,
      },
      active: 1,
    } as GreenTextState,
    (set) => ({
      setText: (to: string) => set(() => ({ text: to })),
      setTransformState: (
        to: number | { initial: number; final: number },
        at: string
      ) =>
        set((state) => ({
          transformState: { ...state.transformState, [at]: to },
        })),
      toggleActive: () => set((state) => ({ active: Number(!state.active) })),
    })
  )
);

export const useHudStore = create<HUDState>((set) => ({
  id: "fg_hud_1",
  active: 1,
  setId: (to) => set(() => ({ id: to })),
  toggleActive: () => set((state) => ({ active: Number(!state.active) })),
}));

export const useNodeStore = create(
  combine(
    {
      activeNodeState: {
        id: "0422",
        posX: 0,
        posZ: 0,
        rotZ: 0,
        posY: 0,
        interactedWith: false,
        exploding: false,
        shrinking: false,
        visible: true,
      },
      nodeMatrixIndices: { matrixIdx: 7, rowIdx: 0, colIdx: 0 },
      gameProgress: game_progress,
    } as NodeState,
    (set) => ({
      setActiveNodeState: (to: number | boolean | string, at: string) =>
        set((state) => ({
          activeNodeState: { ...state.activeNodeState, [at]: to },
        })),
      setNodeMatrixIndices: (to: {
        matrixIdx: number;
        rowIdx: number;
        colIdx: number;
      }) => set(() => ({ nodeMatrixIndices: to })),
    })
  )
);

export const useLainStore = create<LainState>((set) => ({
  lainMoveState: "standing",
  setLainMoveState: (to) => set(() => ({ lainMoveState: to })),
}));

export const useStarfieldStore = create<StarfieldState>((set) => ({
  introStarfieldVisible: false,
  mainStarfieldVisible: true,
  mainStarfieldBoostVal: 0.2,
  setIntroStarfieldVisible: (to) => set(() => ({ introStarfieldVisible: to })),
  setMainStarfieldVisible: (to) => set(() => ({ mainStarfieldVisible: to })),
  setMainStarfieldBoostVal: (to) => set(() => ({ mainStarfieldBoostVal: to })),
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
    } as any,
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

export const useMainSceneStore = create<MainSceneState>((set) => ({
  intro: true,
  subscene: "site",
  setSubscene: (to) => set(() => ({ subscene: to })),
  setIntro: (to) => set(() => ({ intro: to })),
}));

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

