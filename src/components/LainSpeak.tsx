import React, { useMemo, useRef } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import takIntro from "../static/sprite/tak_intro.png";
import takOutro from "../static/sprite/tak_outro.png";
import mouth1 from "../static/sprite/mouth_1.png";
import mouth2 from "../static/sprite/mouth_2.png";
import mouth3 from "../static/sprite/mouth_3.png";
import mouth4 from "../static/sprite/mouth_4.png";
import { useStore } from "../store";
import { LainConstructor } from "./MainScene/Lain";

type LainTaKProps = {
  intro: boolean;
  outro: boolean;
};

const LainSpeak = (props: LainTaKProps) => {
  const mouth1Tex = useLoader(THREE.TextureLoader, mouth1);
  const mouth2Tex = useLoader(THREE.TextureLoader, mouth2);
  const mouth3Tex = useLoader(THREE.TextureLoader, mouth3);
  const mouth4Tex = useLoader(THREE.TextureLoader, mouth4);

  const Intro = () => (
    <LainConstructor
      sprite={takIntro}
      frameCount={31}
      framesHorizontal={6}
      framesVertical={6}
    />
  );

  const Outro = () => (
    <LainConstructor
      sprite={takOutro}
      frameCount={39}
      framesHorizontal={7}
      framesVertical={6}
    />
  );

  const mouthRef = useRef<THREE.SpriteMaterial>();
  const audioAnalyser = useStore((state) => state.audioAnalyser);

  useFrame(() => {
    if (audioAnalyser) {
      const freq = parseInt(String(audioAnalyser.getAverageFrequency()));

      if (mouthRef.current) {
        if (freq >= 50) {
          mouthRef.current.map = mouth4Tex;
        } else if (freq >= 40 && freq <= 50) {
          mouthRef.current.map = mouth3Tex;
        } else if (freq >= 30 && freq <= 40) {
          mouthRef.current.map = mouth2Tex;
        } else {
          mouthRef.current.map = mouth1Tex;
        }
      }
    }
  });

  const animationDispatch = useMemo(() => {
    if (props.intro) return <Intro />;
    else if (props.outro) return <Outro />;
  }, [props.intro, props.outro]);

  return (
    <>
      <sprite scale={[11, 7.7, 0]} visible={props.intro || props.outro}>
        {animationDispatch}
      </sprite>
      <sprite
        scale={[11, 7.7, 0]}
        renderOrder={2}
        visible={!props.intro && !props.outro}
      >
        <spriteMaterial
          attach="material"
          map={mouth4Tex}
          alphaTest={0.01}
          ref={mouthRef}
          depthTest={false}
        />
      </sprite>
    </>
  );
};

export default LainSpeak;
