import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "@/store";
import { useTexture } from "@react-three/drei";
import { handleEvent } from "@/core";
import { setShowingAbout } from "@/core/events";
import {playAudio} from "@/utils/audio";

const About = () => {
  const showingAbout = useStore((state) => state.showingAbout);
  const aboutBg = useTexture("/sprites/main/about_background.png");

  const bgRef = useRef<THREE.Sprite>(null);

  useFrame((_, delta) => {
    if (bgRef.current) {
      bgRef.current.position.y += delta;
      if (Math.round(bgRef.current.position.y) === 14) {
        handleEvent(setShowingAbout(false));
      }
    }
  });

  useEffect(() => {
    let audio: HTMLAudioElement;
    if (showingAbout) {
      audio = playAudio("about_theme.mp4", true);
    }
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [showingAbout]);

  return (
    <>
      {showingAbout && (
        <>
          <sprite renderOrder={199} scale={[100, 100, 0]}>
            <spriteMaterial color={0x000000} depthTest={false} />
          </sprite>
          <sprite
            ref={bgRef}
            scale={[10.5 / 2.5, 52.8 / 2.5, 0]}
            position={[1.1, -11.5, 0.1]}
            renderOrder={200}
          >
            <spriteMaterial map={aboutBg} depthTest={false} />
          </sprite>
        </>
      )}
    </>
  );
};

export default About;
