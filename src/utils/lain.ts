import { Direction, LainAnimation } from "@/types";

export const getAnimationForDirection = (direction: Direction) => {
  switch (direction) {
    case Direction.Up:
      return LainAnimation.JumpUp;
    case Direction.Down:
      return LainAnimation.JumpDown;
    case Direction.Left:
      return LainAnimation.MoveLeft;
    case Direction.Right:
      return LainAnimation.MoveRight;
  }
};
