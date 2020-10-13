import React, { useEffect, useMemo } from "react";
import { useSetRecoilState } from "recoil";
import {
  currentHUDAtom,
  hudActiveAtom,
  mediumHudTextAtom,
} from "../HUD/HUDElementAtom";
import blue_orb_huds from "../../resources/blue_orb_huds.json";

const BlueOrbHUDStateManager = (props: any) => {
  const setHudActive = useSetRecoilState(hudActiveAtom);
  const setCurrentHUDElement = useSetRecoilState(currentHUDAtom);
  const setMediumHudText = useSetRecoilState(mediumHudTextAtom);

  const dispatcherObjects = useMemo(
    () => ({
      moveUp: { duration: 3903.704 },
      moveDown: { duration: 3903.704 },
      rotateLeft: { duration: 3903.704 },
      rotateRight: { duration: 3903.704 },
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
      const targetBlueOrbGreenText = props.targetBlueOrbGreenText;

      const targetBlueOrbHudData =
        blue_orb_huds[targetBlueOrbHudId as keyof typeof blue_orb_huds];

      const dispatchedAction =
        dispatcherObjects[props.eventState as keyof typeof dispatcherObjects];

      // setHudActive((prev: boolean) => !prev);
      setHudActive((prev: number) => Number(!prev));

      setTimeout(() => {
        setCurrentHUDElement(targetBlueOrbHudData);
        setMediumHudText(targetBlueOrbGreenText);
        setHudActive((prev: number) => Number(!prev));
      }, dispatchedAction.duration);
    }
  }, [
    dispatcherObjects,
    props.eventState,
    props.targetBlueOrbGreenText,
    props.targetBlueOrbHudId,
    setCurrentHUDElement,
    setHudActive,
    setMediumHudText,
  ]);
  return null;
};

export default BlueOrbHUDStateManager;
