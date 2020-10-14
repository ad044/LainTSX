import React, { useEffect, useMemo } from "react";
import { useSetRecoilState } from "recoil";
import {
  currentHUDAtom,
  mediumHudTextAtom,
} from "../HUD/HUDElementAtom";
import { useBlueOrbStore } from "../store";

const BlueOrbHUDStateManager = (props: any) => {
  const setCurrentHudId = useBlueOrbStore((state) => state.setCurrentHudId);
  const toggleHud = useBlueOrbStore((state) => state.toggleHud);

  const setCurrentHUDElement = useSetRecoilState(currentHUDAtom);
  const setMediumHudText = useSetRecoilState(mediumHudTextAtom);

  const dispatcherObjects = useMemo(
    () => ({
      moveUp: { duration: 3903.704 },
      moveDown: { duration: 3903.704 },
      moveLeft: { duration: 3903.704 },
      moveRight: { duration: 3903.704 },
      changeBlueOrbUp: { duration: 500 },
      changeBlueOrbDown: { duration: 500 },
      changeBlueOrbLeft: { duration: 500 },
      changeBlueOrbRight: { duration: 500 },
    }),
    []
  );

  useEffect(() => {
    if (props.eventState) {
      const targetBlueOrbHudId = props.targetBlueOrbHudId;

      const dispatchedAction =
        dispatcherObjects[props.eventState as keyof typeof dispatcherObjects];

      // setHudActive((prev: boolean) => !prev);
      toggleHud();

      setTimeout(() => {
        setCurrentHudId(targetBlueOrbHudId);
        // setCurrentHUDElement(targetBlueOrbHudData);
        // setMediumHudText(targetBlueOrbGreenText);
        toggleHud();
      }, dispatchedAction.duration);
    }
  }, [
    dispatcherObjects,
    props.eventState,
    props.targetBlueOrbGreenText,
    props.targetBlueOrbHudId,
    setCurrentHUDElement,
    setCurrentHudId,
    setMediumHudText,
    toggleHud,
  ]);
  return null;
};

export default BlueOrbHUDStateManager;
