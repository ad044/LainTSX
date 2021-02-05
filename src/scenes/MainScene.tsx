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

  useEffect(() => {
    if (intro) {
      if (introWrapperRef.current) {
        introWrapperRef.current.rotation.x = Math.PI / 2;
        introWrapperRef.current.position.z = -10;
      }
      setStarfieldIntro(false);
      setLainIntroAnim(false);
      setIntroFinished(false);
    }
  }, [intro]);

  const [starfieldIntro, setStarfieldIntro] = useState(false);
  const [lainIntroAnim, setLainIntroAnim] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const introWrapperRef = useRef<THREE.Group>();

  useFrame(() => {
    if (intro && introWrapperRef.current) {
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

      if (
        Math.round(introWrapperRef.current.position.z) === 0 &&
        Math.round(introWrapperRef.current.rotation.x) === 0 &&
        !introFinished
      ) {
        setIntroFinished(true);
      }

      if (introWrapperRef.current.position.z < 0) {
        introWrapperRef.current.position.z += 0.05;
      }
      if (introWrapperRef.current.rotation.x > 0) {
        introWrapperRef.current.rotation.x -= 0.008;
      }
    }
  });

  return (
    <perspectiveCamera position-z={3}>
      <Suspense fallback={null}>
        <LevelSelection />
        <Pause />
        <group visible={!paused}>
          <group visible={!wordSelected && (intro ? introFinished : true)}>
            <HUD />
            <YellowTextRenderer />
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
        <group ref={introWrapperRef}>
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
