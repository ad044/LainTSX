import { useCallback, useEffect } from "react";
import { StateManagerProps } from "../EventManager";
import { useAuthorizeUserStore } from "../../../store";

const BootAuthorizeUserManager = (props: StateManagerProps) => {
  const setActiveLetterTextureOffset = useAuthorizeUserStore(
    (state) => state.setActiveLetterTexOffset
  );
  const setBgLettersPos = useAuthorizeUserStore(
    (state) => state.setBgLettersPos
  );

  const updateAuthorizeUser = useCallback(
    (
      newBgLettersPos: { x: number; y: number },
      newActiveLetterTexOffset: { x: number; y: number }
    ) => {
      setActiveLetterTextureOffset(newActiveLetterTexOffset);
      setBgLettersPos(newBgLettersPos);
    },
    [setActiveLetterTextureOffset, setBgLettersPos]
  );

  const dispatchObject = useCallback(
    (
      event: string,
      newBgLettersPos: { x: number; y: number },
      newActiveLetterTexOffset: { x: number; y: number }
    ) => {
      switch (event) {
        case "authorize_user_left":
        case "authorize_user_up":
        case "authorize_user_down":
        case "authorize_user_right":
          return {
            action: updateAuthorizeUser,
            value: [newBgLettersPos, newActiveLetterTexOffset],
          };
      }
    },
    [updateAuthorizeUser]
  );

  useEffect(() => {
    if (props.eventState) {
      const eventAction = props.eventState.event;
      const newBgLettersPos = props.eventState.newBgLettersPos;
      const newActiveLetterTexOffset =
        props.eventState.newActiveLetterTexOffset;

      const dispatchedObject = dispatchObject(
        eventAction,
        newBgLettersPos,
        newActiveLetterTexOffset
      );
      if (dispatchedObject) {
        dispatchedObject.action.apply(null, dispatchedObject.value as any);
      }
    }
  }, [dispatchObject, props.eventState]);
  return null;
};

export default BootAuthorizeUserManager;
