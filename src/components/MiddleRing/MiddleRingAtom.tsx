import { atom } from "recoil";

export const middleRingWobbleStrengthAtom = atom({
  key: "middleRingWobbleStrengthAtom",
  default: 0.0,
});

export const middleRingRotatingAtom = atom({
  key: "middleRingRotatingAtom",
  default: true,
});

export const middleRingNoiseAtom = atom({
  key: "middleRingNoiseAtom",
  default: 0.03,
});

export const middleRingPosYAtom = atom({
  key: "middleRingPosYAtom",
  default: -0.11,
});

export const middleRingRotXAtom = atom({
  key: "middleRingRotXAtom",
  default: 0,
});

export const middleRingRotZAtom = atom({
  key: "middleRingRotZAtom",
  default: 0,
});

export const middleRingAnimDurationAtom = atom({
  key: "middleRingAnimDurationAtom",
  default: 600,
});
