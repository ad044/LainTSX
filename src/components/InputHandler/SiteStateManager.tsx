import React, { useEffect, useMemo } from "react";
import { useSetRecoilState } from "recoil";
import {
  isSiteYChangingAtom,
  sitePosYAtom,
  siteRotYAtom,
} from "../Site/SiteAtom";

const SiteStateManager = (props: any) => {
  const setSiteRotY = useSetRecoilState(siteRotYAtom);
  const setSitePosY = useSetRecoilState(sitePosYAtom);
  const setIsSiteYChanging = useSetRecoilState(isSiteYChangingAtom);

  const dispatcherObjects = useMemo(
    () => ({
      moveUp: { action: "move", value: -1.5 },
      moveDown: { action: "move", value: 1.5 },
      rotateLeft: { action: "rotate", value: Math.PI / 4 },
      rotateRight: { action: "rotate", value: -Math.PI / 4 },
    }),
    []
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedAction =
        dispatcherObjects[props.eventState as keyof typeof dispatcherObjects];

      if (dispatchedAction) {
        switch (dispatchedAction.action) {
          case "rotate":
            setTimeout(() => {
              setSiteRotY((prev: number) => prev + dispatchedAction.value);
            }, 1100);
            break;
          case "move":
            setTimeout(() => {
              setSitePosY((prev: number) => prev + dispatchedAction.value);
            }, 1300);
            break;
          default:
            break;
        }
        setTimeout(() => {
          setIsSiteYChanging(false);
        }, 3000);
      }
    }
  }, [
    dispatcherObjects,
    props.eventState,
    setIsSiteYChanging,
    setSitePosY,
    setSiteRotY,
  ]);
  return null;
};

export default SiteStateManager;
