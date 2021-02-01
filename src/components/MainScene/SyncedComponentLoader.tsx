import React, { useEffect, useMemo, useState } from "react";
import HUD from "./SyncedComponents/HUD";
import YellowTextRenderer from "../TextRenderer/YellowTextRenderer";
import YellowOrb from "./SyncedComponents/YellowOrb";
import GrayPlanes from "./SyncedComponents/GrayPlanes";
import Starfield from "./SyncedComponents/Starfield";
import Site from "./SyncedComponents/Site";
import MiddleRing from "./SyncedComponents/MiddleRing";
import Lain from "./Lain";
import { useStore } from "../../store";

type SyncedComponentLoaderProps = {
  paused: boolean;
  shouldIntro: boolean;
};

const SyncedComponentLoader = (props: SyncedComponentLoaderProps) => {
  const [introFinished, setIntroFinished] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!props.shouldIntro) {
      document.getElementsByTagName("canvas")[0].className =
        "main-scene-background";
    }
    setTimeout(() => {
      setIntroFinished(true);
      document.getElementsByTagName("canvas")[0].className =
        "main-scene-background";
    }, 4000);
  }, [props.shouldIntro]);

  const subscene = useStore((state) => state.mainSubscene);

  useEffect(() => {
    if (subscene === "pause") {
      setTimeout(() => {
        setPaused(true);
      }, 3400);
    } else {
      setPaused(false);
    }
  }, [subscene]);

  const visible = useMemo(() => {
    return props.shouldIntro ? introFinished : true;
  }, [introFinished, props.shouldIntro]);

  return (
    <>
      <group visible={visible && !paused}>
        <HUD />
        <YellowTextRenderer />
        <YellowOrb visible={visible && !paused} />
        <MiddleRing />
        <GrayPlanes />
      </group>
      <Starfield
        visible={!paused}
        shouldIntro={props.shouldIntro}
        introFinished={introFinished}
      />
      <Site shouldIntro={props.shouldIntro} introFinished={introFinished} />
      <Lain shouldIntro={props.shouldIntro} />
    </>
  );
};

export default SyncedComponentLoader;
