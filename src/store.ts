import create from "zustand";
import { combine } from "zustand/middleware";
import * as THREE from "three";

type SceneState = {
  currentScene: string;
  setScene: (to: string) => void;
};

type HUDState = {
  id: string;
  active: number;
  visible: boolean;
  setId: (to: string) => void;
  toggleActive: () => void;
};

type NodeState = {
  activeNodeState: {
    id: string;
    posX: number;
    posZ: number;
    rotZ: number;
    interactedWith: boolean;
  };
  nodeMatrixIndices: { matrixIdx: number; rowIdx: number; colIdx: number };
};

type LainState = {
  lainMoveState: string;
  setLainMoveState: (to: string) => void;
};

type GrayPlanesState = {
  grayPlanesVisible: boolean;
  setGrayPlanesVisible: (to: boolean) => void;
};

type StarfieldState = {
  introStarfieldVisible: boolean;
  mainStarfieldVisible: boolean;
  mainStarfieldBoostVal: number;
  setIntroStarfieldVisible: (to: boolean) => void;
  setMainStarfieldVisible: (to: boolean) => void;
  setMainStarfieldBoostVal: (to: number) => void;
};

type YellowOrbState = {
  yellowOrbVisible: boolean;
  setYellowOrbVisible: (to: boolean) => void;
};

type SiteState = {
  siteRotY: number;
  sitePosY: number;
  setSiteRotY: (to: number) => void;
  setSitePosY: (to: number) => void;
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
};

type MediaWordState = {
  wordPositionDataStruct: {
    cross: { posX: number; posY: number };
    fstWord: { posX: number; posY: number };
    sndWord: { posX: number; posY: number };
    thirdWord: { posX: number; posY: number };
  }[];
  wordPositionDataStructIdx: number;
  words: string[];
  setWords: (to: string[]) => void;
  addToWordPositionDataStructIdx: (val: number) => void;
  resetWordPositionDataStructIdx: () => void;
};

export type YellowTextState = {
  disableTrail: boolean;
  text: string;
  transformState: {
    posX: number;
    posY: number;
    xOffset: number;
  };
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

export type TextRendererState = {
  greenTextPosY: number;
  greenTextPosX: { initial: number; final: number };
  greenText: string;
  greenTextActive: number;
  setGreenTextPosY: (to: number) => void;
  setGreenTextPosX: (to: { initial: number; final: number }) => void;
  setGreenText: (to: string) => void;
  toggleGreenText: () => void;
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

export const useYellowTextStore = create(
  combine(
    {
      disableTrail: false,
      text: "Play",
      transformState: {
        posX: 0,
        posY: 0,
        xOffset: 0,
      },
    } as YellowTextState,
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
    })
  )
);

export const useGreenTextStore = create(
  combine(
    {
      text: "TOUKO's DIARY",
      transformState: {
        posX: { initial: 0, final: 0 },
        posY: 0,
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
  visible: true,
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
        interactedWith: false,
      },
      nodeMatrixIndices: { matrixIdx: 7, rowIdx: 0, colIdx: 0 },
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

export const useGrayPlanesStore = create<GrayPlanesState>((set) => ({
  grayPlanesVisible: true,
  setGrayPlanesVisible: (to) => set(() => ({ grayPlanesVisible: to })),
}));

export const useStarfieldStore = create<StarfieldState>((set) => ({
  introStarfieldVisible: false,
  mainStarfieldVisible: true,
  mainStarfieldBoostVal: 0.2,
  setIntroStarfieldVisible: (to) => set(() => ({ introStarfieldVisible: to })),
  setMainStarfieldVisible: (to) => set(() => ({ mainStarfieldVisible: to })),
  setMainStarfieldBoostVal: (to) => set(() => ({ mainStarfieldBoostVal: to })),
}));

export const useYellowOrbStore = create<YellowOrbState>((set) => ({
  yellowOrbVisible: false,
  setYellowOrbVisible: (to) => set(() => ({ yellowOrbVisible: to })),
}));

export const useSiteStore = create<SiteState>((set) => ({
  sitePosY: 0,
  siteRotY: 0,
  setSitePosY: (to) => set(() => ({ sitePosY: to })),
  setSiteRotY: (to) => set(() => ({ siteRotY: to })),
}));

export const useMiddleRingStore = create(
  combine(
    {
      transformState: {
        wobbleStrength: 0,
        noiseStrength: 0.03,
        posY: -0.11,
        rotX: 0,
        rotZ: 0,
      },
      isRotating: true,
      animDuration: 600,
    } as MiddleRingState,
    (set) => ({
      setTransformState: (to: number, at: string) =>
        set((state) => ({
          transformState: { ...state.transformState, [at]: to },
        })),
      setRotating: (to: boolean) => ({ isRotating: to }),
      setAnimDuration: (to: number) => ({ animDuration: to }),
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
      toggleLeftComponent: () =>
        set((state) => ({
          componentMatrixIndices: {
            ...state.componentMatrixIndices,
            leftSideIdx: Number(!state.componentMatrixIndices.leftSideIdx),
          },
        })),
      addToRightComponentMatrixIdx: (val: number) =>
        set((state) => {
          let finalVal;
          const newSum = state.componentMatrixIndices["rightSideIdx"] + val;
          if (newSum > 2) {
            finalVal = 0;
          } else if (newSum < 0) {
            finalVal = 2;
          } else {
            finalVal = newSum;
          }
          return {
            componentMatrixIndices: {
              ...state.componentMatrixIndices,
              rightSideIdx: finalVal,
            },
          };
        }),
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
  words: ["eye", "quiet", "hallucination"],
  wordPositionDataStruct: [
    {
      cross: {
        posX: -2,
        posY: 2,
      },
      fstWord: { posX: 0, posY: 0 },
      sndWord: { posX: 3, posY: -3 },
      thirdWord: { posX: 3.7, posY: -4.3 },
    },
    {
      cross: {
        posX: -0.5,
        posY: 0.5,
      },
      fstWord: { posX: 1.8, posY: -2.5 },
      sndWord: { posX: 1.5, posY: -1.5 },
      thirdWord: { posX: 3.3, posY: -3.7 },
    },
    {
      cross: {
        posX: 1,
        posY: -1,
      },
      fstWord: { posX: 3.7, posY: -4.3 },
      sndWord: { posX: 0, posY: 0 },
      thirdWord: { posX: 3, posY: -3 },
    },
    {
      cross: {
        posX: 1.3,
        posY: -1.7,
      },
      fstWord: { posX: 3.3, posY: -3.7 },
      sndWord: { posX: 1.8, posY: -2.5 },
      thirdWord: { posX: 1.5, posY: -1.5 },
    },
    {
      cross: {
        posX: 1.7,
        posY: -2.3,
      },
      fstWord: { posX: 3, posY: -3 },
      sndWord: { posX: 3.7, posY: -4.3 },
      thirdWord: { posX: 0, posY: 0 },
    },
    {
      cross: {
        posX: -0.4,
        posY: -0.5,
      },
      fstWord: { posX: 1.5, posY: -1.5 },
      sndWord: { posX: 3.3, posY: -3.7 },
      thirdWord: { posX: 1.8, posY: -2.5 },
    },
  ],
  wordPositionDataStructIdx: 0,
  addToWordPositionDataStructIdx: (val) =>
    set((state) => ({
      wordPositionDataStructIdx:
        state.wordPositionDataStructIdx > 4 ||
        state.wordPositionDataStructIdx < -4
          ? 0
          : state.wordPositionDataStructIdx + val,
    })),
  setWords: (to) => set(() => ({ words: to })),
  resetWordPositionDataStructIdx: () =>
    set(() => ({ wordPositionDataStructIdx: 0 })),
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

export const useBootStore = create(
  combine(
    {
      componentMatrix: {
        main_menu: ["authorize_user", "load_data"],
        load_data: ["load_data_yes", "load_data_no"],
        authorize_user: [
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
          [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
          [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51],
          [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63],
        ],
      },
      bgLettersPos: {
        x: 3.35,
        y: -0.7,
      },
      activeLetterTextureOffset: {
        x: 0,
        y: -0.2,
      },
      componentMatrixIndices: {
        // 0 or 1
        main_menu: 0,
        // 0 or 1
        load_data: 0,
        authorize_user: {
          row: 0,
          col: 0,
        },
      },
      // main_menu, load_data or authorize_user
      subscene: "authorize_user",
    } as any,
    (set) => ({
      toggleComponentMatrixIdx: (subscene: string) =>
        set((state) => ({
          componentMatrixIndices: {
            ...state.componentMatrixIndices,
            [subscene]: Number(!state.componentMatrixIndices[subscene]),
          },
        })),
      setSubscene: (to: string) => set(() => ({ subscene: to })),
      moveAuthorizeUserLetters: (direction: string) =>
        set((state) => {
          let initialPos = state.bgLettersPos;
          let initialActiveLetterTextureOffset =
            state.activeLetterTextureOffset;
          let initialLetterRowIdx =
            state.componentMatrixIndices.authorize_user.row;
          let initialLetterColIdx =
            state.componentMatrixIndices.authorize_user.col;

          let axis: string;
          let finalPosVal: number;
          let finalTextureOffsetVal: number;
          let finalLetterRowIdx: number;
          let finalLetterColIdx: number;

          switch (direction) {
            case "right":
              axis = "x";
              if (initialPos.x - 0.3 < -0.25) {
                finalPosVal = -0.25;
                finalLetterRowIdx = 12;
                finalTextureOffsetVal = 0.93;
              } else {
                finalPosVal = initialPos.x - 0.3;
                finalLetterRowIdx = initialLetterRowIdx + 1;
                finalTextureOffsetVal =
                  initialActiveLetterTextureOffset.x + 0.0775;
              }
              finalLetterColIdx = initialLetterColIdx;
              break;
            case "left":
              axis = "x";
              if (initialPos.x + 0.3 > 3.35) {
                finalPosVal = 3.35;
                finalLetterRowIdx = 0;
                finalTextureOffsetVal = 0;
              } else {
                finalPosVal = initialPos.x + 0.3;
                finalTextureOffsetVal =
                  initialActiveLetterTextureOffset.x - 0.0775;
                finalLetterRowIdx = initialLetterRowIdx - 1;
              }
              finalLetterColIdx = initialLetterColIdx;
              break;
            case "up":
              axis = "y";
              if (initialPos.y - 0.25 < -0.7) {
                finalPosVal = -0.7;
                finalLetterColIdx = 0;
                finalTextureOffsetVal = -0.2;
              } else {
                finalPosVal = initialPos.y - 0.25;
                finalTextureOffsetVal =
                  initialActiveLetterTextureOffset.y + 0.2;
                finalLetterColIdx = initialLetterColIdx - 1;
              }
              finalLetterRowIdx = initialLetterRowIdx;
              break;
            case "down":
              axis = "y";
              if (initialPos.y + 0.25 > 0.3) {
                finalPosVal = 0.3;
                finalLetterColIdx = 4;
                finalTextureOffsetVal = -1;
              } else {
                finalPosVal = initialPos.y + 0.25;
                finalTextureOffsetVal =
                  initialActiveLetterTextureOffset.y - 0.2;
                finalLetterColIdx = initialLetterColIdx + 1;
              }
              finalLetterRowIdx = initialLetterRowIdx;
              break;
          }
          return {
            bgLettersPos: {
              ...state.bgLettersPos,
              [axis!]: finalPosVal!,
            },
            activeLetterTextureOffset: {
              ...state.activeLetterTextureOffset,
              [axis!]: finalTextureOffsetVal!,
            },
            componentMatrixIndices: {
              ...state.componentMatrixIndices,
              authorize_user: {
                row: finalLetterRowIdx!,
                col: finalLetterColIdx!,
              },
            },
          };
        }),
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
