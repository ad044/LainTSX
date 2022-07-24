import { GameSite, Direction, SiteLayout } from "@/types";
import siteBLayoutJson from "@/json/site_b_layout.json";
import siteALayoutJson from "@/json/site_a_layout.json";

// if prev rotation value is provided it will return a value based on the nearest coterminal angle.
// we do this because when rotation "resets" (i.e. goes from previous value to 0)
// spring (the library used to animate stuff) will animate the full rotation
// which will make it go back AROUND the site, instead of only 45 degrees
// so we use coterminal angles to substitute the original rotation.

// for example when at 315 and rotating towards 360, the original calculation would return
// 0, which would rotate the site backwards for the entire -315 degrees
// whereas we only needed it to rotate another 45 (till 360).

const FULL_CIRCLE = Math.PI * 2;

export const getRotationForSegment = (
  segment: number,
  prevRotation?: number
) => {
  const rotation = (Math.PI / 4) * (segment - 6);

  if (prevRotation !== undefined) {
    // circle count
    const cc = Math.floor(prevRotation / FULL_CIRCLE);

    // original angle
    const o = rotation + cc * FULL_CIRCLE;
    // positive coterminal angle
    const pc = rotation + FULL_CIRCLE + cc * FULL_CIRCLE;
    // negative coterminal
    const nc = rotation - FULL_CIRCLE - cc * FULL_CIRCLE;

    // distance from originally calculated value
    const od = Math.abs(o - prevRotation);
    // distance from positive coterminal
    const pcd = Math.abs(pc - prevRotation);
    // distance from negative
    const ncd = Math.abs(nc - prevRotation);

    switch (Math.min(od, pcd, ncd)) {
      case od:
        return o;
      case pcd:
        return pc;
      case ncd:
        return nc;
    }
  }

  return rotation;
};

export const getLevelY = (level: number) => {
  return -4.5 + level * 1.5;
};

export const getLevelLimit = (site: GameSite) => {
  switch (site) {
    case GameSite.A:
      return 22;
    case GameSite.B:
      return 13;
  }
};

export const getLevelDigits = (level: number): [number, number] => {
  return [Math.floor(level / 10), level % 10];
};

export const getChangeDirection = (
  segment: number,
  prevSegment: number
): Direction.Right | Direction.Left => {
  if (prevSegment === 7 && segment === 0) {
    return Direction.Left;
  }

  if (prevSegment === 0 && segment === 7) {
    return Direction.Right;
  }

  if (prevSegment < segment) {
    return Direction.Left;
  } else {
    return Direction.Right;
  }
};

export const getLayout = (site: GameSite): SiteLayout => {
  switch (site) {
    case GameSite.A:
      return siteALayoutJson as SiteLayout;
    case GameSite.B:
      return siteBLayoutJson as SiteLayout;
  }
};

