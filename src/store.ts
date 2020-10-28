import create from "zustand";
import { combine } from "zustand/middleware";

type SceneState = {
  currentScene: string;
  setScene: (to: string) => void;
};

type BlueOrbState = {
  activeBlueOrbId: string;
  activeHudId: string;
  hudActive: number;
  hudVisible: boolean;
  isActiveBlueOrbInteractedWith: boolean;
  activeBlueOrbPosX: number;
  activeBlueOrbPosZ: number;
  activeBlueOrbRotZ: number;
  setActiveBlueOrbPosX: (to: number) => void;
  setActiveBlueOrbPosZ: (to: number) => void;
  setActiveBlueOrbRotZ: (to: number) => void;
  setActiveBlueOrbId: (to: string) => void;
  setActiveBlueOrbHudId: (to: string) => void;
  toggleHud: () => void;
  setIsActiveBlueOrbInteractedWith: (to: boolean) => void;
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
  incrementSiteRotY: (by: number) => void;
  incrementSitePosY: (by: number) => void;
  setSiteRotY: (to: number) => void;
  setSitePosY: (to: number) => void;
  setIsSiteChanging: (to: boolean) => void;
};

type LevelState = {
  activeLevels: string[];
  setActiveLevels: (to: string[]) => void;
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

type MediaState = {
  mediaPercentageElapsed: number;
  activeMediaComponent: string;
  setActiveMediaComponent: (to: string) => void;
  lastActiveLeftSideElement: string;
  setLastActiveLeftSideElement: (to: string) => void;
  lastActiveRightSideElement: string;
  setLastActiveRightSideElement: (to: string) => void;
  setMediaPercentageElapsed: (to: number) => void;
};

type TextRendererState = {
  yellowText: string;
  yellowTextPosY: number;
  yellowTextPosX: number;
  yellowTextOffsetXCoeff: number;
  setYellowText: (to: string) => void;
  incrementYellowTextPosY: (by: number) => void;
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

// type ImageState = {
//   fstImg: ImageSrc | undefined;
//   sndImg: ImageSrc | undefined;
//   thirdImg: ImageSrc | undefined;
//   setFstImg: (to: ImageSrc) => void;
//   setSndImg: (to: ImageSrc) => void;
//   setThirdImg: (to: ImageSrc) => void;
// };
//
export const useTextRendererStore = create<TextRendererState>((set) => ({
  // yellow text
  yellowText: "Play",
  yellowTextPosY: 0.23,
  yellowTextPosX: -0.35,
  yellowTextOffsetXCoeff: 0,
  setYellowText: (to) => set(() => ({ yellowText: to })),
  incrementYellowTextPosY: (by) =>
    set((state) => ({ yellowTextPosY: state.yellowTextPosY + by })),
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

export const useBlueOrbStore = create<BlueOrbState>((set) => ({
  activeBlueOrbId: "0422",
  activeHudId: "fg_hud_1",
  hudActive: 1,
  isActiveBlueOrbInteractedWith: false,
  hudVisible: true,
  activeBlueOrbPosX: 0,
  activeBlueOrbPosZ: 0,
  activeBlueOrbRotZ: 0,
  setActiveBlueOrbPosX: (to) => set(() => ({ activeBlueOrbPosX: to })),
  setActiveBlueOrbPosZ: (to) => set(() => ({ activeBlueOrbPosZ: to })),
  setActiveBlueOrbRotZ: (to) => set(() => ({ activeBlueOrbRotZ: to })),
  setActiveBlueOrbId: (to) => set(() => ({ activeBlueOrbId: to })),
  setActiveBlueOrbHudId: (to) => set(() => ({ activeHudId: to })),
  toggleHud: () => set((state) => ({ hudActive: Number(!state.hudActive) })),
  setIsActiveBlueOrbInteractedWith: (to) =>
    set(() => ({ isActiveBlueOrbInteractedWith: to })),
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
  incrementSitePosY: (by) =>
    set((state) => ({ sitePosY: state.sitePosY + by })),
  incrementSiteRotY: (by) =>
    set((state) => ({ siteRotY: state.siteRotY + by })),
  setSitePosY: (to) => set(() => ({ sitePosY: to })),
  setSiteRotY: (to) => set(() => ({ siteRotY: to })),
  setIsSiteChanging: (to) => set(() => ({ isSiteChangingY: to })),
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
  activeLevels: ["03", "04", "05"],
  setActiveLevels: (to) => set(() => ({ activeLevels: to })),
}));

export const useMediaStore = create<MediaState>((set) => ({
  // we can't have one global activeMediaComponent because both right and left col
  // elements need to be stored (when you switch back and forth between the columns,
  // you end up on the last active element FROM THAT COLUMN).
  // so we store leftColActiveMediaComponent as well as rightCol.
  mediaPercentageElapsed: 0,
  activeMediaComponent: "play",
  setActiveMediaComponent: (to) => set(() => ({ activeMediaComponent: to })),
  lastActiveLeftSideElement: "play",
  lastActiveRightSideElement: "fstWord",
  setLastActiveLeftSideElement: (to) =>
    set(() => ({ lastActiveLeftSideElement: to })),
  setLastActiveRightSideElement: (to) =>
    set(() => ({ lastActiveRightSideElement: to })),
  setMediaPercentageElapsed: (to) =>
    set(() => ({ mediaPercentageElapsed: to })),
}));

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

export const useSceneStore = create<SceneState>((set) => ({
  currentScene: "main",
  setScene: (to) => set(() => ({ currentScene: to })),
}));

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
