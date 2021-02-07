import React, { useRef } from "react";
import aboutBg from "../../../static/sprite/about_background.png";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { useStore } from "../../../store";

const About = () => {
  const setShowingAbout = useStore((state) => state.setShowingAbout);
  const aboutBgTex = useLoader(THREE.TextureLoader, aboutBg);

  const bgRef = useRef<THREE.Sprite>();
  // todo im not sure where the other bg file is located,
  // the one here is just the text, in the original game there's another one

  useFrame(() => {
    if (bgRef.current) {
      bgRef.current.position.y += 0.03;
      if (Math.round(bgRef.current.position.y) === 14) {
        setShowingAbout(false);
      }
    }
  });

  return (
    <>
      <sprite renderOrder={199} scale={[100, 100, 0]}>
        <spriteMaterial attach="material" color={0x000000} depthTest={false} />
      </sprite>
      <sprite
        ref={bgRef}
        scale={[10.5 / 2.5, 52.8 / 2.5, 0]}
        position={[1.1, -13, 0]}
        renderOrder={200}
      >
        <spriteMaterial attach="material" map={aboutBgTex} depthTest={false} />
      </sprite>
    </>
  );
};

export default About;
