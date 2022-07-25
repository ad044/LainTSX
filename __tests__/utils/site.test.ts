import { Direction } from "@/types";
import { getRotationForSegment } from "@/utils/site";

const doCircles = (
  segment: number,
  count: number,
  direction: Direction.Left | Direction.Right,
  startRotation?: number
): [number, number] => {
  let currentCount = 0;
  let rotation = startRotation ?? getRotationForSegment(segment);
  let prevRotation = rotation;
  while (currentCount < count) {
    if (direction === Direction.Left) {
      segment -= 1;
    }

    if (direction === Direction.Right) {
      segment += 1;
    }

    if (segment > 7) {
      currentCount += 1;
      segment = 0;
    }

    if (segment < 0) {
      currentCount += 1;
      segment = 7;
    }

    prevRotation = rotation;
    rotation = getRotationForSegment(segment, prevRotation);
    if (direction === Direction.Left) {
      expect(rotation).toBeCloseTo(prevRotation - Math.PI / 4, 6);
    }

    if (direction === Direction.Right) {
      expect(rotation).toBeCloseTo(prevRotation + Math.PI / 4, 6);
    }
  }

  return [segment, rotation];
};

it("Checks if rotation calculator works", () => {
  // site is initially positioned like this
  doCircles(6, 3, Direction.Left);
  doCircles(6, 3, Direction.Right);
  doCircles(4, 6, Direction.Left);
  doCircles(0, 6, Direction.Left);
  // move to right then move to left based on last coordinates
  let [segment, rotation] = doCircles(7, 6, Direction.Right);
  doCircles(segment, 6, Direction.Left, rotation);
});
