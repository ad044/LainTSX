import React, { useEffect, useMemo, useState } from "react";
import HUD from "./SyncedComponents/HUD";
import GreenTextRenderer from "../TextRenderer/GreenTextRenderer";
import YellowTextRenderer from "../TextRenderer/YellowTextRenderer";
import YellowOrb from "./SyncedComponents/YellowOrb";
import LevelSelection from "./SyncedComponents/LevelSelection";
import GrayPlanes from "./SyncedComponents/GrayPlanes";
import Starfield from "./SyncedComponents/Starfield";
import Site from "./SyncedComponents/Site";

type SyncedComponentLoaderProps = {
  paused: boolean;
  shouldIntro: boolean;
};

const SyncedComponentLoader = (props: SyncedComponentLoaderProps) => {
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIntroFinished(true);
    }, 4000);
  }, []);

  const visible = useMemo(() => {
    if (props.paused) {
      return false;
    } else {
      return props.shouldIntro ? introFinished : true;
    }
  }, [introFinished, props.paused, props.shouldIntro]);

  return (
    <>
      <group visible={visible}>
        <HUD />
        <GreenTextRenderer />
        <YellowTextRenderer />
        <YellowOrb visible={visible} />
        <LevelSelection />
        <GrayPlanes />
      </group>
      <Starfield />
      <Site shouldIntro={props.shouldIntro} introFinished={introFinished} />
    </>
  );
};

export default SyncedComponentLoader;
