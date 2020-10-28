import { useCallback, useEffect } from "react";
import { useBlueOrbStore } from "../../store";
import game_action_mappings from "../../resources/game_action_mappings.json";
import { StateManagerProps } from "./EventManager";

type SetActiveBlueOrb = (value: string) => void;
type SetIsActiveBlueOrbInteractedWith = (value: boolean) => void;

type BlueOrbDispatchData = {
  action: SetActiveBlueOrb | SetIsActiveBlueOrbInteractedWith;
  value: string | boolean;
  actionDelay: number;
};

type BlueOrbDispatcher = {
  move_up: BlueOrbDispatchData;
  move_down: BlueOrbDispatchData;
  move_left: BlueOrbDispatchData;
  move_right: BlueOrbDispatchData;
  change_blue_orb: BlueOrbDispatchData;
  select_blue_orb: BlueOrbDispatchData;
};

const BlueOrbManager = (props: StateManagerProps) => {
  const setActiveBlueOrb: SetActiveBlueOrb = useBlueOrbStore(
    (state) => state.setActiveBlueOrbId
  );
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

  const dispatchObject = useCallback(
    (event: string, targetBlueOrbId: string) => {
      const dispatcherObjects: BlueOrbDispatcher = {
        move_up: {
          action: setActiveBlueOrb,
          value: targetBlueOrbId,
          actionDelay: 3903.704,
        },
        move_down: {
          action: setActiveBlueOrb,
          value: targetBlueOrbId,
          actionDelay: 3903.704,
        },
        move_left: {
          action: setActiveBlueOrb,
          value: targetBlueOrbId,
          actionDelay: 3903.704,
        },
        move_right: {
          action: setActiveBlueOrb,
          value: targetBlueOrbId,
          actionDelay: 3903.704,
        },
        change_blue_orb: {
          action: setActiveBlueOrb,
          value: targetBlueOrbId,
          actionDelay: 0,
        },
        select_blue_orb: {
          action: animateActiveBlueOrbThrow,
          value: true,
          actionDelay: 0,
        },
      };

      return dispatcherObjects[event as keyof typeof dispatcherObjects];
    },
    [animateActiveBlueOrbThrow, setActiveBlueOrb]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventObject: any =
        game_action_mappings[
          props.eventState as keyof typeof game_action_mappings
        ];

      if (eventObject) {
        const eventAction = eventObject.action;
        const targetBlueOrbId = eventObject.target_blue_orb_id;

        const dispatchedObject = dispatchObject(eventAction, targetBlueOrbId);

        if (dispatchedObject) {
          setTimeout(() => {
            dispatchedObject.action(dispatchedObject.value as never);
          }, dispatchedObject.actionDelay);
        }
      }
    }
  }, [props.eventState, setActiveBlueOrb, dispatchObject]);
  return null;
};

export default BlueOrbManager;
