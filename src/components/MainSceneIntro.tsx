import React, { memo, useEffect } from "react";
import {
  useBlueOrbStore,
  useGrayPlanesStore,
  useLainStore,
  useMainGroupStore,
  useStarfieldStore,
  useYellowOrbStore,
} from "../store";

// ghost component to manipulate the intro action for the main scene.

// we separate this file because having something like this
// inside <Suspense> tags makes it behave in a more stable manner
// by waiting for the components to load and synchronously calling the functions.
const MainSceneIntro = memo(() => {
  const toggleHud = useBlueOrbStore((state) => state.toggleHud);

  //const setHudVisible = useSetRecoilState(hudVisibilityAtom);
  const setOrbVisible = useYellowOrbStore((state) => state.setYellowOrbVisible);

  const setLainMoveState = useLainStore((state) => state.setLainMoveState);

  const setIntroStarfieldVisible = useStarfieldStore(
    (state) => state.setIntroStarfieldVisible
  );
  const setMainStarfieldVisible = useStarfieldStore(
    (state) => state.setMainStarfieldVisible
  );
  const setMainStarfieldBoostVal = useStarfieldStore(
    (state) => state.setMainStarfieldBoostVal
  );

  const setMainGroupPosY = useMainGroupStore((state) => state.setMainGroupPosY);
  const setMainGroupPosZ = useMainGroupStore((state) => state.setMainGroupPosZ);
  const setMainGroupRotX = useMainGroupStore((state) => state.setMainGroupRotX);

  const setGrayPlanesVisible = useGrayPlanesStore(
    (state) => state.setGrayPlanesVisible
  );

  useEffect(() => {
    setMainGroupPosY(0);
    setMainGroupPosZ(0);
    setTimeout(() => {
      setMainGroupRotX(0);
    }, 2400);

    setTimeout(() => {
      setGrayPlanesVisible(true);
    }, 2500);

    setTimeout(() => {
      setMainStarfieldVisible(true);
      setMainStarfieldBoostVal(0);
    }, 2800);

    toggleHud();

    setTimeout(() => {
      setLainMoveState("standing");

      setOrbVisible(true);
      //setHudVisible(true);

      setIntroStarfieldVisible(false);

      toggleHud();
      setTimeout(() => {
        document.getElementsByTagName("canvas")[0].className = "hub-background";
      }, 300);
    }, 3860);
  }, [
    setGrayPlanesVisible,
    setMainStarfieldBoostVal,
    setMainStarfieldVisible,
    setOrbVisible,
    setIntroStarfieldVisible,
    setMainGroupRotX,
    setMainGroupPosZ,
    setMainGroupPosY,
    setLainMoveState,
    toggleHud,
  ]);

  return <></>;
});

export default MainSceneIntro;
