import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import {
  isSiteYChangingAtom,
  sitePosYAtom,
  siteRotYAtom,
} from "../Site/SiteAtom";
import { StateManagerProps } from "./InputHandler";

const SiteStateManager = (props: StateManagerProps) => {
  const setSiteRotY = useSetRecoilState(siteRotYAtom);
  const setSitePosY = useSetRecoilState(sitePosYAtom);
  const setIsSiteYChanging = useSetRecoilState(isSiteYChangingAtom);

  useEffect(() => {
    if (props.eventState) {
      const moveDirection = props.eventState.moveDirection;

      if (moveDirection) {
        setIsSiteYChanging(true);
        switch (moveDirection) {
          case "up":
            setTimeout(() => {
              setSitePosY((prev: number) => prev - 1.5);
            }, 1300);
            break;
          case "down":
            setTimeout(() => {
              setSitePosY((prev: number) => prev + 1.5);
            }, 1300);
            break;
          case "left":
            setTimeout(() => {
              setSiteRotY((prev: number) => prev + Math.PI / 4);
            }, 1100);
            break;
          case "right":
            setTimeout(() => {
              setSiteRotY((prev: number) => prev - Math.PI / 4);
            }, 1100);
            break;
          default:
            break;
        }

        setTimeout(() => {
          setIsSiteYChanging(false);
        }, 3000);
      }
    }
  }, [props.eventState, setIsSiteYChanging, setSitePosY, setSiteRotY]);
  return null;
};

export default SiteStateManager;
