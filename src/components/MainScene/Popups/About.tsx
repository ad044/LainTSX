import React, { useEffect, useRef } from "react";
import aboutBg from "../../../static/sprites/main/about_background.png";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { useStore } from "../../../store";
import { aboutSceneMusic } from "../../../static/sfx";

const About = () => {
  const showingAbout = useStore((state) => state.showingAbout);
  const setShowingAbout = useStore((state) => state.setShowingAbout);
  const aboutBgTex = useLoader(THREE.TextureLoader, aboutBg);

  const bgRef = useRef<THREE.Sprite>();

  useFrame(() => {
    if (bgRef.current) {
      bgRef.current.position.y += 0.01;
      if (Math.round(bgRef.current.position.y) === 14) {
        setShowingAbout(false);
      }
    }
  });

  useEffect(() => {
    const play = () => {
      aboutSceneMusic.currentTime = 1;
      aboutSceneMusic.volume = 0.5;
      aboutSceneMusic.loop = true;
      aboutSceneMusic.play();
    };

    if (showingAbout) play();

    return () => {
      aboutSceneMusic.pause();
    };
  }, [showingAbout]);

  return (
    <>
      {showingAbout && (
        <>
          <sprite renderOrder={199} scale={[100, 100, 0]}>
            <spriteMaterial
              attach="material"
              color={0x000000}
              depthTest={false}
            />
          </sprite>
          <sprite
            ref={bgRef}
            scale={[10.5 / 2.5, 52.8 / 2.5, 0]}
            position={[1.1, -11.5, 0.1]}
            renderOrder={200}
          >
            <spriteMaterial
              attach="material"
              map={aboutBgTex}
              depthTest={false}
            />
          </sprite>
        </>
      )}
    </>
  );
};

export default About;
