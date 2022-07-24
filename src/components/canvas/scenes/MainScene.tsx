import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/store";
import { playAudio } from "@/utils/audio";
import LevelSelection from "@canvas/objects/MainScene/LevelSelection";
import HUD from "@canvas/objects/MainScene/HUD";
import YellowOrb from "@canvas/objects/MainScene/YellowOrb";
import MiddleRing from "@canvas/objects/MainScene/MiddleRing";
import Starfield from "@canvas/objects/MainScene/Starfield";
import Site from "@canvas/objects/MainScene/Site";
import Lain from "@canvas/objects/MainScene/Lain";
import Loading from "@canvas/objects/Loading";
import usePrevious from "@/hooks/usePrevious";
import { a, useSpring } from "@react-spring/three";
import Pause from "@canvas/objects/MainScene/Pause";
import GrayPlane from "@canvas/objects/MainScene/GrayPlane";
import { MainSubscene, Position } from "@/types";
import { handleEvent } from "@/core";
import {
  resetInputCooldown,
  setInputCooldown,
  setWordSelected,
} from "@/core/events";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import About from "@canvas/objects/MainScene/About";
import Prompt from "@canvas/objects/Prompt";
import PermissionDenied from "@canvas/objects/MainScene/PermissionDenied";
import SaveStatusDisplay from "@canvas/objects/SaveStatusDisplay";
import NotFound from "@canvas/objects/MainScene/NotFound";

const MainScene = () => {
  const mainSceneBg = useTexture("/sprites/main/main_scene_background.png");

  const intro = useStore((state) => state.intro);
  const [paused, setPaused] = useState(false);
  const subscene = useStore((state) => state.mainSubscene);
  const prev = usePrevious({ subscene });

  const wordSelected = useStore((state) => state.wordSelected);
  const showingAbout = useStore((state) => state.showingAbout);
  const wordNotFound = useStore((state) => state.wordNotFound);

  const grayPlaneGroupRef = useRef<THREE.Group>(null);

  const grayPlanePoses: Position[] = useMemo(
    () => [
      [1.2, 0, -1.2],
      [1.2, 0, 1.2],
      [1.2, 0, -0.5],
      [-1.2, 0, -1.2],
      [-1.2, 0, 1.2],
      [-1.2, 0, 1],
      [0.5, 0, 1],
    ],
    []
  );

  const [bgSpring, setBgSpring] = useSpring<{ position: Position }>(() => ({
    position: [0, 0, 0],
    duration: 1200,
  }));

  useEffect(() => {
    if (subscene === MainSubscene.Pause) {
      setTimeout(() => setBgSpring({ position: [0, 2, 0] }), 3600);
      setTimeout(() => setPaused(true), 3400);
    } else if (
      prev?.subscene === MainSubscene.Pause &&
      subscene === MainSubscene.Site
    ) {
      setBgSpring({ position: [0, 0, 0] });
      setTimeout(() => setPaused(false), 1200);
    }
  }, [prev?.subscene, setBgSpring, subscene]);

  useEffect(() => {
    if (wordSelected) {
      setTimeout(() => handleEvent(setWordSelected(false)), 3100);
    }
  }, [wordSelected]);

  const introWrapperRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (intro) {
      setStarfieldIntro(false);
      setLainIntroAnim(false);
      setIntroFinished(false);

      starfieldIntroRef.current = false;
      lainIntroRef.current = false;
      introFinishedRef.current = false;

      handleEvent(setInputCooldown(-1));
    } else {
      handleEvent(resetInputCooldown);
    }
  }, [intro]);

  const [starfieldIntro, setStarfieldIntro] = useState(false);
  const starfieldIntroRef = useRef(false);
  const [lainIntroAnim, setLainIntroAnim] = useState(false);
  const lainIntroRef = useRef(false);
  const [introFinished, setIntroFinished] = useState(false);
  const introFinishedRef = useRef(false);

  useFrame((_, delta) => {
    if (!introFinished && intro && introWrapperRef.current) {
      if (introWrapperRef.current.position.z === -10) playAudio("snd_32.mp4");
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
        introWrapperRef.current.position.z += 2.5 * delta;
      }
      if (introWrapperRef.current.rotation.x > 0) {
        introWrapperRef.current.rotation.x -= 0.4 * delta;
      }

      if (
        !introFinishedRef.current &&
        introWrapperRef.current.rotation.x < 0 &&
        introWrapperRef.current.position.z > 0
      ) {
        introFinishedRef.current = true;
        setIntroFinished(true);

        handleEvent(resetInputCooldown);
      }
    }

    if (grayPlaneGroupRef.current) {
      grayPlaneGroupRef.current.rotation.y -= delta / 1.5;
    }
  });

  useEffect(() => {
    let audio: HTMLAudioElement;
    if (intro) {
      if (introFinished) {
        audio = playAudio("lain_main_theme.mp4", true);
      }
    } else {
      audio = playAudio("lain_main_theme.mp4", true);
    }

    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [intro, introFinished, showingAbout]);

  const [tiltSpring, setTiltSpring] = useSpring(() => ({
    value: 0,
    config: { duration: 200 },
  }));

  useEffect(() =>
    useStore.subscribe(
      (state) => state.cameraTiltValue,
      (tilt) => setTiltSpring({ value: tilt })
    )
  );

  return (
    <group position-z={3}>
      <Suspense fallback={<Loading />}>
        <LevelSelection />
        <Pause />
        <group position={[-0.85, -0.7, 0]} scale={[0.85, 0.85, 0]}>
          <group position={[1, 0.6, 0]} scale={[1.2, 1.2, 0]}>
            <Prompt />
          </group>
          <About />
          <PermissionDenied />
          <SaveStatusDisplay />
        </group>
        <NotFound />
        <a.group
          visible={intro ? introFinished : true}
          position={bgSpring.position}
        >
          <mesh renderOrder={-5} scale={[5, 1, 0]}>
            <planeBufferGeometry attach="geometry" />
            <meshBasicMaterial map={mainSceneBg} depthTest={false} />
          </mesh>
        </a.group>
        <group visible={!paused}>
          <group visible={!wordSelected && (intro ? introFinished : true)}>
            <a.group visible={!wordNotFound} position-y={tiltSpring.value}>
              <HUD />
            </a.group>
            <MiddleRing />
            <group position={[0.1, 0, -2]} ref={grayPlaneGroupRef}>
              {grayPlanePoses.map((position, idx: number) => (
                <GrayPlane position={position} key={idx} />
              ))}
            </group>
          </group>
          <group visible={intro ? introFinished : true}>
            <YellowOrb visible={!paused} />
          </group>
          <Starfield
            shouldIntro={intro}
            mainVisible={intro ? starfieldIntro : true}
          />
        </group>
        <a.group visible={!wordSelected} position-y={tiltSpring.value}>
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
