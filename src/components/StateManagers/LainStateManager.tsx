import React, { useEffect, useMemo } from "react";
import { useLainStore } from "../../store";

const LainStateManager = (props: any) => {
  const setLainMoveState = useLainStore((state) => state.setLainMoveState);

  const dispatcherObjects = useMemo(
    () => ({
      moveUp: { action: "moveUp", duration: 3903.704 },
      moveDown: { action: "moveDown", duration: 3903.704 },
      moveLeft: { action: "moveLeft", duration: 3903.704 },
      moveRight: { action: "moveRight", duration: 3903.704 },
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
          setLainMoveState("standing");
        }, dispatchedAction.duration);
      }
    }
  }, [dispatcherObjects, props.eventState, setLainMoveState]);

  return null;
};

export default LainStateManager;
