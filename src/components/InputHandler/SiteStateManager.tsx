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
      moveUp: { action: setSitePosY, value: -1.5, actionDelay: 1300 },
      moveDown: { action: setSitePosY, value: 1.5, actionDelay: 1300 },
      moveLeft: { action: setSiteRotY, value: Math.PI / 4, actionDelay: 1100 },
      moveRight: {
        action: setSiteRotY,
        value: -Math.PI / 4,
        actionDelay: 1100,
      },
    }),
    [setSitePosY, setSiteRotY]
  );

  useEffect(() => {
    if (props.eventState) {
      const dispatchedAction =
        dispatcherObjects[props.eventState as keyof typeof dispatcherObjects];

      if (dispatchedAction) {
        setIsSiteYChanging(true);

        setTimeout(() => {
          dispatchedAction.action(
            (prev: number) => prev + dispatchedAction.value
          );
        }, dispatchedAction.actionDelay);

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
