import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { lainMoveStateAtom, lainMovingAtom } from "../Lain/LainAtom";
import {
  LainMoveDown,
  LainMoveLeft,
  LainMoveRight,
  LainMoveUp,
  LainStanding,
  LainThrowBlueOrb,
} from "../Lain/Lain";
import lain_animations from "../../resources/lain_animations.json";
import { StateManagerProps } from "./InputHandler";

const LainStateManager = (props: StateManagerProps) => {
  const setLainMoving = useSetRecoilState(lainMovingAtom);
  const setLainMoveState = useSetRecoilState(lainMoveStateAtom);

  useEffect(() => {
    if (props.eventState) {
      const moveDirection = props.eventState.moveDirection;

      if (moveDirection) {
        setLainMoving(true);
        switch (moveDirection) {
          case "down":
            setLainMoveState(<LainMoveDown />);
            break;
          case "left":
            setLainMoveState(<LainMoveLeft />);
            break;
          case "up":
            setLainMoveState(<LainMoveUp />);
            break;
          case "right":
            setLainMoveState(<LainMoveRight />);
            break;
          case "throw_blue_orb":
            setLainMoveState(<LainThrowBlueOrb />);
            break;
          default:
            break;
        }
        setTimeout(() => {
          setLainMoveState(<LainStanding />);
          setTimeout(() => {
            setLainMoving(false);
          }, 300);
        }, lain_animations[moveDirection as keyof typeof lain_animations].duration);
      }
    }
  }, [props.eventState, setLainMoveState, setLainMoving]);

  return null;
};

export default LainStateManager;
