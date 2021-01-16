import React, { useEffect, useMemo, useState } from "react";
import HUD from "./SyncedComponents/HUD";
import YellowTextRenderer from "../TextRenderer/YellowTextRenderer";
import YellowOrb from "./SyncedComponents/YellowOrb";
import GrayPlanes from "./SyncedComponents/GrayPlanes";
import Starfield from "./SyncedComponents/Starfield";
import Site from "./SyncedComponents/Site";
import MiddleRing from "./SyncedComponents/MiddleRing";
import MainSceneEventManager from "../../core/StateManagers/MainSceneEventManager";
import Pause from "./PauseSubscene/Pause";
import { a } from "@react-spring/three";

type SyncedComponentLoaderProps = {
  paused: boolean;
  shouldIntro: boolean;
};

const SyncedComponentLoader = (props: SyncedComponentLoaderProps) => {
  const [introFinished, setIntroFinished] = useState(false);

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
        <YellowTextRenderer />
        <YellowOrb visible={visible} />
        <MiddleRing />
        <GrayPlanes />
      </group>
      <Starfield
        visible={!props.paused}
        shouldIntro={props.shouldIntro}
        introFinished={introFinished}
      />
      <Pause visible={props.paused} />
      <Site shouldIntro={props.shouldIntro} introFinished={introFinished} />
      <MainSceneEventManager
        loaded={props.shouldIntro ? introFinished : true}
      />
    </>
  );
};

export default SyncedComponentLoader;
