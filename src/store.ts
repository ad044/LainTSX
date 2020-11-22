import create from "zustand";
import { combine } from "zustand/middleware";
import * as THREE from "three";

type SceneState = {
  currentScene: string;
  setScene: (to: string) => void;
};

type HUDState = {
  activeHudId: string;
  hudActive: number;
  hudVisible: boolean;
  setActiveNodeHudId: (to: string) => void;
  toggleHud: () => void;
};

type NodeState = {
  activeNodeId: string;
  isActiveNodeInteractedWith: boolean;
  activeNodePosX: number;
  activeNodePosZ: number;
  activeNodeRotZ: number;
  setActiveNodePosX: (to: number) => void;
  setActiveNodePosZ: (to: number) => void;
  setActiveNodeRotZ: (to: number) => void;
  setActiveNodeId: (to: string) => void;
  setIsActiveNodeInteractedWith: (to: boolean) => void;
  nodeMatrixIndices: { rowIdx: number; colIdx: number };
  setNodeMatrixIndices: (to: { rowIdx: number; colIdx: number }) => void;
};

type LainState = {
  lainMoveState: string;
  setLainMoveState: (to: string) => void;
};

type MainGroupState = {
  mainGroupPosY: number;
  mainGroupPosZ: number;
  mainGroupRotX: number;
  setMainGroupPosY: (to: number) => void;
  setMainGroupPosZ: (to: number) => void;
  setMainGroupRotX: (to: number) => void;
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
  isSiteChangingY: boolean;
  addToSiteRotY: (by: number) => void;
  addToSitePosY: (by: number) => void;
  setSiteRotY: (to: number) => void;
  setSitePosY: (to: number) => void;
  setIsSiteChanging: (to: boolean) => void;
  siteRotIdx: string;
  setSiteRotIdx: (to: string) => void;
};

type LevelState = {
  currentLevel: string;
  activeLevels: string[];
  setActiveLevels: (to: string[]) => void;
  setCurrentLevel: (to: string) => void;
};

type MiddleRingState = {
  middleRingWobbleStrength: number;
  middleRingRotating: boolean;
  middleRingNoise: number;
  middleRingPosY: number;
  middleRingRotX: number;
  middleRingRotZ: number;
  middleRingAnimDuration: number;
  setMiddleRingWobbleStrength: (to: number) => void;
  setMiddleRingRotating: (to: boolean) => void;
  setMiddleRingNoise: (to: number) => void;
  addToMiddleRingPosY: (val: number) => void;
  setMiddleRingPosY: (to: number) => void;
  setMiddleRingRotX: (to: number) => void;
  setMiddleRingRotZ: (to: number) => void;
  setMiddleRingAnimDuration: (to: number) => void;
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

export type TextRendererState = {
  yellowText: string;
  yellowTextPosY: number;
  yellowTextPosX: number;
  yellowTextOffsetXCoeff: number;
  setYellowText: (to: string) => void;
  addToYellowTextPosY: (val: number) => void;
  addToYellowTextPosX: (val: number) => void;
  setYellowTextPosY: (to: number) => void;
  setYellowTextPosX: (to: number) => void;
  setYellowTextOffsetXCoeff: (to: number) => void;
  greenTextPosY: number;
  greenTextPosX: { initial: number; final: number };
  greenText: string;
  greenTextActive: number;
  setGreenTextPosY: (to: number) => void;
  setGreenTextPosX: (to: { initial: number; final: number }) => void;
  setGreenText: (to: string) => void;
  toggleGreenText: () => void;
};

export type ImageSrc = {
  default: string;
};

type ImageState = {
  images: {
    1: ImageSrc | undefined;
    2: ImageSrc | undefined;
    3: ImageSrc | undefined;
  };
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

export const useTextRendererStore = create<TextRendererState>((set) => ({
  // yellow text
  yellowText: "Play",
  yellowTextPosY: 0.23,
  yellowTextPosX: -0.35,
  yellowTextOffsetXCoeff: 0,
  setYellowText: (to) => set(() => ({ yellowText: to })),
  addToYellowTextPosY: (val) =>
    set((state) => ({ yellowTextPosY: state.yellowTextPosY + val })),
  addToYellowTextPosX: (val) =>
    set((state) => ({ yellowTextPosX: state.yellowTextPosX + val })),
  setYellowTextPosY: (to) => set(() => ({ yellowTextPosY: to })),
  setYellowTextPosX: (to) => set(() => ({ yellowTextPosX: to })),
  setYellowTextOffsetXCoeff: (to) =>
    set(() => ({ yellowTextOffsetXCoeff: to })),
  // green text
  greenText: "TOUKO's DIARY",
  greenTextPosY: 0,
  greenTextPosX: { initial: 0, final: 0 },
  greenTextActive: 1,
  setGreenTextPosY: (to) => set(() => ({ greenTextPosY: to })),
  setGreenTextPosX: (to) => set({ greenTextPosX: to }),
  setGreenText: (to) => set(() => ({ greenText: to })),
  toggleGreenText: () =>
    set((state) => ({ greenTextActive: Number(!state.greenTextActive) })),
}));

export const useHudStore = create<HUDState>((set) => ({
  activeHudId: "fg_hud_1",
  hudActive: 1,
  hudVisible: true,
  setActiveNodeHudId: (to) => set(() => ({ activeHudId: to })),
  toggleHud: () => set((state) => ({ hudActive: Number(!state.hudActive) })),
}));

export const useNodeStore = create<NodeState>((set) => ({
  activeNodeId: "0422",
  isActiveNodeInteractedWith: false,
  activeNodePosX: 0,
  activeNodePosZ: 0,
  activeNodeRotZ: 0,
  setActiveNodePosX: (to) => set(() => ({ activeNodePosX: to })),
  setActiveNodePosZ: (to) => set(() => ({ activeNodePosZ: to })),
  setActiveNodeRotZ: (to) => set(() => ({ activeNodeRotZ: to })),
  setActiveNodeId: (to) => set(() => ({ activeNodeId: to })),
  setIsActiveNodeInteractedWith: (to) =>
    set(() => ({ isActiveNodeInteractedWith: to })),
  nodeRowIdx: 0,

  nodeMatrixIndices: { rowIdx: 0, colIdx: 0 },
  setNodeMatrixIndices: (to) => set(() => ({ nodeMatrixIndices: to })),
}));

export const useLainStore = create<LainState>((set) => ({
  lainMoveState: "standing",
  setLainMoveState: (to) => set(() => ({ lainMoveState: to })),
}));

// -2.5 - intro val
//-9.5 - intro val
//1.5 - intro val
export const useMainGroupStore = create<MainGroupState>((set) => ({
  mainGroupPosY: 0,
  mainGroupPosZ: 0,
  mainGroupRotX: 0,
  setMainGroupPosY: (to) => set(() => ({ mainGroupPosY: to })),
  setMainGroupPosZ: (to) => set(() => ({ mainGroupPosZ: to })),
  setMainGroupRotX: (to) => set(() => ({ mainGroupRotX: to })),
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
  isSiteChangingY: false,
  addToSitePosY: (by) => set((state) => ({ sitePosY: state.sitePosY + by })),
  addToSiteRotY: (by) => set((state) => ({ siteRotY: state.siteRotY + by })),
  setSitePosY: (to) => set(() => ({ sitePosY: to })),
  setSiteRotY: (to) => set(() => ({ siteRotY: to })),
  setIsSiteChanging: (to) => set(() => ({ isSiteChangingY: to })),
  siteRotIdx: "7",
  setSiteRotIdx: (to) => set(() => ({ siteRotIdx: to })),
}));

export const useMiddleRingStore = create<MiddleRingState>((set) => ({
  middleRingWobbleStrength: 0,
  middleRingRotating: true,
  middleRingNoise: 0.03,
  middleRingPosY: -0.11,
  middleRingRotX: 0,
  middleRingRotZ: 0,
  middleRingAnimDuration: 600,
  setMiddleRingWobbleStrength: (to) =>
    set(() => ({ middleRingWobbleStrength: to })),
  setMiddleRingRotating: (to) => set(() => ({ middleRingRotating: to })),
  setMiddleRingNoise: (to) => set(() => ({ middleRingNoise: to })),
  addToMiddleRingPosY: (by) =>
    set((state) => ({ middleRingPosY: state.middleRingPosY + by })),
  setMiddleRingPosY: (to) => set(() => ({ middleRingPosY: to })),
  setMiddleRingRotX: (to) => set(() => ({ middleRingRotX: to })),
  setMiddleRingRotZ: (to) => set(() => ({ middleRingRotZ: to })),
  setMiddleRingAnimDuration: (to) =>
    set(() => ({ middleRingAnimDuration: to })),
}));

export const useLevelStore = create<LevelState>((set) => ({
  currentLevel: "04",
  activeLevels: ["02", "03", "05", "06"],
  setActiveLevels: (to) => set(() => ({ activeLevels: to })),
  setCurrentLevel: (to) => set(() => ({ currentLevel: to })),
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
  currentScene: "polytan",
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

export const useImageStore = create(
  combine(
    {
      images: { 1: undefined, 2: undefined, 3: undefined },
    } as ImageState,
    (set) => ({
      setImages: (to: ImageSrc, idx: number) =>
        set((state) => ({ images: { ...state.images, [idx]: to } })),
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
