import React, { useEffect, useMemo } from "react";
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

const LainStateManager = (props: any) => {
  const setLainMoving = useSetRecoilState(lainMovingAtom);
  const setLainMoveState = useSetRecoilState(lainMoveStateAtom);

  const dispatcherObjects = useMemo(
    () => ({
      moveUp: { animation: <LainMoveUp />, duration: 3903.704 },
      moveDown: { animation: <LainMoveDown />, duration: 3903.704 },
      rotateLeft: { animation: <LainMoveLeft />, duration: 3903.704 },
      rotateRight: { animation: <LainMoveRight />, duration: 3903.704 },
    }),
    []
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedAction =
        dispatcherObjects[props.eventState as keyof typeof dispatcherObjects];

      if (dispatchedAction) {
        setLainMoveState(dispatchedAction.animation);

        setTimeout(() => {
          setLainMoveState(<LainStanding />);
        }, dispatchedAction.duration);
      }
    }
  }, [dispatcherObjects, props.eventState, setLainMoveState, setLainMoving]);

  return null;
};

export default LainStateManager;
