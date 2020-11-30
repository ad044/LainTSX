import React, { memo, useEffect } from "react";
import { useHudStore, useLainStore, useStarfieldStore } from "../store";

// ghost component to manipulate the intro action for the main scene.

// we separate this file because having something like this
// inside <Suspense> tags makes it behave in a more stable manner
// by waiting for the components to load and synchronously calling the functions.
const MainSceneIntro = memo(() => {
  // todo component

  // -2.5 - intro val
  //-9.5 - intro val
  //1.5 - intro val

  const toggleHud = useHudStore((state) => state.toggleActive);

  //const setHudVisible = useSetRecoilState(hudVisibilityAtom);
  // const setOrbVisible = useYellowOrbStore((state) => state.setYellowOrbVisible);

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

  useEffect(() => {
    setTimeout(() => {
      // setGrayPlanesVisible(true);
    }, 2500);

    setTimeout(() => {
      setMainStarfieldVisible(true);
      setMainStarfieldBoostVal(0);
    }, 2800);

    toggleHud();

    setTimeout(() => {
      setLainMoveState("standing");

      // setOrbVisible(true);
      //setHudVisible(true);

      setIntroStarfieldVisible(false);

      toggleHud();
      setTimeout(() => {
        document.getElementsByTagName("canvas")[0].className =
          "main-scene-background";
      }, 300);
    }, 3860);
  }, [
    setMainStarfieldBoostVal,
    setMainStarfieldVisible,
    setIntroStarfieldVisible,
    setLainMoveState,
    toggleHud,
  ]);

  return <></>;
});

export default MainSceneIntro;
