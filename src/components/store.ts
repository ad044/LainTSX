import create from "zustand";

type HUDState = {
  blueOrbId: string;
  hudId: string;
  hudActive: number;
  yellowHudText: string;
  yellowHudTextPosY: number;
  yellowHudTextPosX: number;
  yellowHudTextOffsetXCoeff: number;
  setCurrentBlueOrbId: (to: string) => void;
  setCurrentHudId: (to: string) => void;
  toggleHud: () => void;
  setYellowHudText: (to: string) => void;
  incrementYellowHudTextPosY: (by: number) => void;
  setYellowHudTextPosY: (to: number) => void;
  setYellowHudTextPosX: (to: number) => void;
  setYellowHudTextOffsetXCoeff: (to: number) => void;
};

export const useBlueOrbStore = create<HUDState>((set) => ({
  blueOrbId: "0422",
  hudId: "fg_hud_1",
  hudActive: 1,
  yellowHudText: "",
  yellowHudTextPosY: 0,
  yellowHudTextPosX: 0,
  yellowHudTextOffsetXCoeff: 0,
  setCurrentBlueOrbId: (to) => set(() => ({ blueOrbId: to })),
  setCurrentHudId: (to) => set(() => ({ hudId: to })),
  toggleHud: () => set((state) => ({ hudActive: Number(!state.hudActive) })),
  setYellowHudText: (to) => set(() => ({ yellowHudText: to })),
  incrementYellowHudTextPosY: (by) =>
    set((state) => ({ yellowHudTextPosY: state.yellowHudTextPosY + by })),
  setYellowHudTextPosY: (to) => set(() => ({ yellowHudTextPosY: to })),
  setYellowHudTextPosX: (to) => set(() => ({ yellowHudTextPosY: to })),
  setYellowHudTextOffsetXCoeff: (to) =>
    set(() => ({ yellowHudTextOffsetXCoeff: to })),
}));
