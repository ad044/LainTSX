import React, { useEffect, useMemo } from "react";
import { useSetRecoilState } from "recoil";
import { lainMoveStateAtom } from "../Lain/LainAtom";
import {
  LainMoveDown,
  LainMoveLeft,
  LainMoveRight,
  LainMoveUp,
  LainStanding,
  LainThrowBlueOrb,
} from "../Lain/Lain";

const LainStateManager = (props: any) => {
  const setLainMoveState = useSetRecoilState(lainMoveStateAtom);

  const dispatcherObjects = useMemo(
    () => ({
      moveUp: { action: <LainMoveUp />, duration: 3903.704 },
      moveDown: { action: <LainMoveDown />, duration: 3903.704 },
      moveLeft: { action: <LainMoveLeft />, duration: 3903.704 },
      moveRight: { action: <LainMoveRight />, duration: 3903.704 },
    }),
    []
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedAction =
        dispatcherObjects[props.eventState as keyof typeof dispatcherObjects];

      if (dispatchedAction) {
        setLainMoveState(dispatchedAction.action);

        setTimeout(() => {
          setLainMoveState(<LainStanding />);
        }, dispatchedAction.duration);
      }
    }
  }, [dispatcherObjects, props.eventState, setLainMoveState]);

  return null;
};

export default LainStateManager;
