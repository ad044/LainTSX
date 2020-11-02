import { useCallback, useEffect } from "react";
import { useBlueOrbStore } from "../../store";
import { StateManagerProps } from "./EventManager";

type UpdateActiveBlueOrb = (
  newActiveBlueOrbId: string,
  newBlueOrbColIdx: number,
  newBlueOrbRowIdx: number
) => void;

type SetIsActiveBlueOrbInteractedWith = (value: boolean) => void;

type BlueOrbDispatchData = {
  action: any;
  value: any;
};

type BlueOrbDispatcher = {
  move_up: BlueOrbDispatchData;
  move_down: BlueOrbDispatchData;
  move_left: BlueOrbDispatchData;
  move_right: BlueOrbDispatchData;
  change_blue_orb: BlueOrbDispatchData;
  throw_blue_orb: BlueOrbDispatchData;
};

const BlueOrbManager = (props: StateManagerProps) => {
  const setActiveBlueOrb = useBlueOrbStore((state) => state.setActiveBlueOrbId);
  const setBlueOrbRowIdx = useBlueOrbStore((state) => state.setBlueOrbRowIdx);
  const setBlueOrbColIdx = useBlueOrbStore((state) => state.setBlueOrbColIdx);

  const setIsActiveBlueOrbInteractedWith: SetIsActiveBlueOrbInteractedWith = useBlueOrbStore(
    (state) => state.setIsActiveBlueOrbInteractedWith
  );
  const setActiveBlueOrbPosX = useBlueOrbStore(
    (state) => state.setActiveBlueOrbPosX
  );
  const setActiveBlueOrbPosZ = useBlueOrbStore(
    (state) => state.setActiveBlueOrbPosZ
  );
  const setActiveBlueOrbRotZ = useBlueOrbStore(
    (state) => state.setActiveBlueOrbRotZ
  );

  const animateActiveBlueOrbThrow = useCallback(() => {
    setIsActiveBlueOrbInteractedWith(true);

    setActiveBlueOrbPosZ(0.3);
    setActiveBlueOrbPosX(0.9);

    setTimeout(() => {
      setActiveBlueOrbPosZ(0.2);
      setActiveBlueOrbPosX(0.5);
    }, 800);
    setTimeout(() => {
      setActiveBlueOrbPosX(1.55);
      setActiveBlueOrbRotZ(-0.005);
    }, 2600);
    setTimeout(() => {
      setActiveBlueOrbPosZ(2);
      setActiveBlueOrbPosX(0);
      setActiveBlueOrbRotZ(-0.5);
    }, 2700);

    setTimeout(() => {
      setActiveBlueOrbRotZ(0);
      setIsActiveBlueOrbInteractedWith(false);
    }, 3800);
  }, [
    setActiveBlueOrbPosX,
    setActiveBlueOrbPosZ,
    setActiveBlueOrbRotZ,
    setIsActiveBlueOrbInteractedWith,
  ]);

  const updateActiveBlueOrb = useCallback(
    (
      delay: number,
      newActiveBlueOrbId: string,
      newBlueOrbColIdx: number,
      newBlueOrbRowIdx: number
    ) => {
      setActiveBlueOrb("");
      setTimeout(() => {
        setActiveBlueOrb(newActiveBlueOrbId);
        setBlueOrbColIdx(newBlueOrbColIdx);
        setBlueOrbRowIdx(newBlueOrbRowIdx);
      }, delay);
    },
    [setActiveBlueOrb, setBlueOrbColIdx, setBlueOrbRowIdx]
  );

  const dispatchObject = useCallback(
    (
      event: string,
      newActiveBlueOrbId: string,
      newBlueOrbColIdx: number,
      newBlueOrbRowIdx: number
    ) => {
      const dispatcherObjects: BlueOrbDispatcher = {
        move_up: {
          action: updateActiveBlueOrb,
          value: [
            3903.704,
            newActiveBlueOrbId,
            newBlueOrbColIdx,
            newBlueOrbRowIdx,
          ],
        },
        move_down: {
          action: updateActiveBlueOrb,
          value: [
            3903.704,
            newActiveBlueOrbId,
            newBlueOrbColIdx,
            newBlueOrbRowIdx,
          ],
        },
        move_left: {
          action: updateActiveBlueOrb,
          value: [
            3903.704,
            newActiveBlueOrbId,
            newBlueOrbColIdx,
            newBlueOrbRowIdx,
          ],
        },
        move_right: {
          action: updateActiveBlueOrb,
          value: [
            3903.704,
            newActiveBlueOrbId,
            newBlueOrbColIdx,
            newBlueOrbRowIdx,
          ],
        },
        change_blue_orb: {
          action: updateActiveBlueOrb,
          value: [0, newActiveBlueOrbId, newBlueOrbColIdx, newBlueOrbRowIdx],
        },
        throw_blue_orb: {
          action: animateActiveBlueOrbThrow,
          value: [0, true],
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [animateActiveBlueOrbThrow, updateActiveBlueOrb]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newActiveBlueOrbId = props.eventState.newActiveBlueOrbId;
      const newBlueOrbRowIdx = props.eventState.newBlueOrbRowIdx;
      const newBlueOrbColIdx = props.eventState.newBlueOrbColIdx;

      const dispatchedObject = dispatchObject(
        eventAction,
        newActiveBlueOrbId,
        newBlueOrbColIdx,
        newBlueOrbRowIdx
      );

      if (dispatchedObject) {
        dispatchedObject.action.apply(null, dispatchedObject.value);
      }
    }
  }, [props.eventState, setActiveBlueOrb, dispatchObject]);
  return null;
};

export default BlueOrbManager;
