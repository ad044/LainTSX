import { OrbitControls } from "@react-three/drei";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useStore } from "../store";
import Pause from "../components/MainScene/PauseSubscene/Pause";
import LevelSelection from "../components/MainScene/LevelSelection";
import HUD from "../components/MainScene/HUD";
import YellowTextRenderer from "../components/TextRenderer/YellowTextRenderer";
import YellowOrb from "../components/MainScene/YellowOrb";
import MiddleRing from "../components/MainScene/MiddleRing";
import GrayPlanes from "../components/MainScene/GrayPlanes";
import Starfield from "../components/MainScene/Starfield";
import Site from "../components/MainScene/Site";
import Lain from "../components/MainScene/Lain";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import NotFound from "../components/MainScene/NotFound";
import PausePopUps from "../components/MainScene/PauseSubscene/PausePopUps";
import { playAudio } from "../store";
import * as audio from "../static/sfx";

const MainScene = () => {
  const intro = useStore((state) => state.intro);
  const [paused, setPaused] = useState(false);
  const subscene = useStore((state) => state.mainSubscene);

  const wordSelected = useStore((state) => state.wordSelected);
  const setWordSelected = useStore((state) => state.setWordSelected);

  useEffect(() => {
    if (subscene === "pause") {
      setTimeout(() => {
        setPaused(true);
      }, 3400);
    } else {
      setPaused(false);
    }
  }, [subscene]);

  useEffect(() => {
    if (wordSelected) {
      setTimeout(() => {
        setWordSelected(false);
      }, 3100);
    }
  }, [setWordSelected, wordSelected]);

  const introWrapperRef = useRef<THREE.Group>();

  useEffect(() => {
    if (intro) {
      setStarfieldIntro(false);
      setLainIntroAnim(false);
      setIntroFinished(false);
    }
  }, [intro]);

  const [starfieldIntro, setStarfieldIntro] = useState(false);
  const [lainIntroAnim, setLainIntroAnim] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  useFrame(() => {
    if (!introFinished && intro && introWrapperRef.current) {
      if (introWrapperRef.current.position.z === -10) playAudio(audio.sound32);
      if (
        Math.round(introWrapperRef.current.position.z) === -3 &&
        !starfieldIntro
      ) {
        setStarfieldIntro(true);
      }
      if (
        Math.round(introWrapperRef.current.position.z) === -1 &&
        !lainIntroAnim
      ) {
        setLainIntroAnim(true);
      }

      if (introWrapperRef.current.position.z < 0) {
        introWrapperRef.current.position.z += 0.05;
      }
      if (introWrapperRef.current.rotation.x > 0) {
        introWrapperRef.current.rotation.x -= 0.008;
      }

      if (
        !(
          introWrapperRef.current.rotation.x > 0 &&
          introWrapperRef.current.position.z < 0
        )
      ) {
        setIntroFinished(true);
      }
    }
  });

  return (
    <perspectiveCamera position-z={3}>
      <Suspense fallback={null}>
        <LevelSelection />
        <PausePopUps />
        <Pause />
        <NotFound visible={subscene === "not_found"} />
        <group visible={!paused}>
          <group visible={!wordSelected && (intro ? introFinished : true)}>
            <group visible={subscene !== "not_found"}>
              <HUD />
              <YellowTextRenderer />
            </group>
            <MiddleRing />
            <GrayPlanes />
          </group>
          <group visible={intro ? introFinished : true}>
            <YellowOrb visible={!paused} />
          </group>
          <Starfield
            shouldIntro={intro}
            mainVisible={intro ? starfieldIntro : true}
          />
        </group>
        <group visible={!wordSelected}>
          <Lain
            shouldAnimate={lainIntroAnim}
            introFinished={intro ? introFinished : true}
          />
        </group>
        <group
          ref={introWrapperRef}
          position-z={intro ? -10 : 0}
          rotation-x={intro ? Math.PI / 2 : 0}
        >
          <Site introFinished={intro ? introFinished : true} />
        </group>
        <OrbitControls />
        <pointLight color={0xffffff} position={[0, 0, 7]} intensity={1} />
        <pointLight color={0x7f7f7f} position={[0, 10, 0]} intensity={1.5} />
        <pointLight color={0xffffff} position={[8, 0, 0]} intensity={0.2} />
        <pointLight color={0xffffff} position={[-8, 0, 0]} intensity={0.2} />
      </Suspense>
    </perspectiveCamera>
  );
};
export default MainScene;
