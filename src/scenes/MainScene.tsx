import React, { Suspense, useEffect, useRef, useState } from "react";
import { playAudio, useStore } from "../store";
import LevelSelection from "../components/MainScene/LevelSelection";
import HUD from "../components/MainScene/HUD";
import MainYellowTextAnimator from "../components/TextRenderer/MainYellowTextAnimator";
import YellowOrb from "../components/MainScene/YellowOrb";
import MiddleRing from "../components/MainScene/MiddleRing/MiddleRing";
import GrayPlanes from "../components/MainScene/GrayPlanes/GrayPlanes";
import Starfield from "../components/MainScene/Starfield/Starfield";
import Site from "../components/MainScene/Site/Site";
import Lain from "../components/MainScene/Lain";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import Popups from "../components/MainScene/Popups/Popups";
import * as audio from "../static/sfx";
import Loading from "../components/Loading";
import usePrevious from "../hooks/usePrevious";
import MainSceneBackground from "../components/MainScene/Site/MainSceneBackground";
import { a, useSpring } from "@react-spring/three";
import Pause from "../components/MainScene/Pause/Pause";
import { mainSceneMusic } from "../static/sfx";

const MainScene = () => {
  const intro = useStore((state) => state.intro);
  const [paused, setPaused] = useState(false);
  const subscene = useStore((state) => state.mainSubscene);
  const prevData = usePrevious({ subscene });

  const wordSelected = useStore((state) => state.wordSelected);
  const showingAbout = useStore((state) => state.showingAbout);
  const setWordSelected = useStore((state) => state.setWordSelected);
  const setInputCooldown = useStore((state) => state.setInputCooldown);
  const wordNotFound = useStore((state) => state.wordNotFound);

  const [bgState, setBgState] = useSpring(() => ({
    posY: 0,
    duration: 1200,
  }));

  useEffect(() => {
    if (subscene === "pause") {
      setTimeout(() => setBgState({ posY: 2 }), 3600);
      setTimeout(() => setPaused(true), 3400);
    } else if (prevData?.subscene === "pause" && subscene === "site") {
      setBgState({ posY: 0 });
      setTimeout(() => setPaused(false), 1200);
    }
  }, [prevData?.subscene, setBgState, subscene]);

  useEffect(() => {
    if (wordSelected) {
      setTimeout(() => setWordSelected(false), 3100);
    }
  }, [setWordSelected, wordSelected]);

  const introWrapperRef = useRef<THREE.Group>();

  useEffect(() => {
    if (intro) {
      setStarfieldIntro(false);
      setLainIntroAnim(false);
      setIntroFinished(false);

      starfieldIntroRef.current = false;
      lainIntroRef.current = false;
      introFinishedRef.current = false;

      setInputCooldown(-1);
    } else {
      setInputCooldown(0);
    }
  }, [intro, setInputCooldown]);

  const [starfieldIntro, setStarfieldIntro] = useState(false);
  const starfieldIntroRef = useRef(false);
  const [lainIntroAnim, setLainIntroAnim] = useState(false);
  const lainIntroRef = useRef(false);
  const [introFinished, setIntroFinished] = useState(false);
  const introFinishedRef = useRef(false);

  useFrame(() => {
    if (!introFinished && intro && introWrapperRef.current) {
      if (introWrapperRef.current.position.z === -10) playAudio(audio.sound32);
      if (
        Math.round(introWrapperRef.current.position.z) === -3 &&
        !starfieldIntroRef.current
      ) {
        setStarfieldIntro(true);
        starfieldIntroRef.current = true;
      }
      if (
        Math.round(introWrapperRef.current.position.z) === -1 &&
        !lainIntroRef.current
      ) {
        setLainIntroAnim(true);
        lainIntroRef.current = true;
      }

      if (introWrapperRef.current.position.z < 0) {
        introWrapperRef.current.position.z += 0.05;
      }
      if (introWrapperRef.current.rotation.x > 0) {
        introWrapperRef.current.rotation.x -= 0.008;
      }

      if (
        !introFinishedRef.current &&
        !(
          introWrapperRef.current.rotation.x > 0 &&
          introWrapperRef.current.position.z < 0
        )
      ) {
        setIntroFinished(true);
        introFinishedRef.current = true;
        setInputCooldown(0);
      }
    }
  });

  useEffect(() => {
    const play = () => {
      mainSceneMusic.currentTime = 0;
      mainSceneMusic.volume = 0.5;
      mainSceneMusic.loop = true;
      mainSceneMusic.play();
    };

    if (intro) {
      if (introFinished) play();
    } else {
      play();
    }

    if (showingAbout) {
      mainSceneMusic.pause();
    }

    return () => {
      mainSceneMusic.pause();
    };
  }, [intro, introFinished, showingAbout]);

  const [tiltState, setTiltState] = useSpring(() => ({
    posY: 0,
    config: { duration: 200 },
  }));

  useEffect(() =>
    useStore.subscribe(setTiltState, (state) => ({
      posY: -state.cameraTiltValue,
    }))
  );

  return (
    <group position-z={3}>
      <Suspense fallback={<Loading />}>
        <LevelSelection />
        <Popups />
        <Pause />
        <a.group
          visible={intro ? introFinished : true}
          position-y={bgState.posY}
        >
          <MainSceneBackground />
        </a.group>
        <group visible={!paused}>
          <group visible={!wordSelected && (intro ? introFinished : true)}>
            <a.group visible={!wordNotFound} position-y={tiltState.posY}>
              <HUD />
              <MainYellowTextAnimator />
            </a.group>
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
        <a.group visible={!wordSelected} position-y={tiltState.posY}>
          <Lain
            shouldAnimate={lainIntroAnim}
            introFinished={intro ? introFinished : true}
          />
        </a.group>
        <group
          ref={introWrapperRef}
          position-z={intro ? -10 : 0}
          rotation-x={intro ? Math.PI / 2 : 0}
        >
          <Site introFinished={intro ? introFinished : true} />
        </group>
        <pointLight color={0xffffff} position={[0, 0, 7]} intensity={1} />
        <pointLight color={0x7f7f7f} position={[0, 10, 0]} intensity={1.5} />
        <pointLight color={0xffffff} position={[8, 0, 0]} intensity={0.2} />
        <pointLight color={0xffffff} position={[-8, 0, 0]} intensity={0.2} />
      </Suspense>
    </group>
  );
};
export default MainScene;
