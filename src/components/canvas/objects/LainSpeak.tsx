import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "@/store";
import { LainConstructor } from "./MainScene/Lain";
import { useTexture } from "@react-three/drei";

type LainTaKProps = {
  intro: boolean;
  outro: boolean;
};

const LainSpeak = (props: LainTaKProps) => {
  const mouth1 = useTexture("/sprites/lain/mouth_1.png");
  const mouth2 = useTexture("/sprites/lain/mouth_2.png");
  const mouth3 = useTexture("/sprites/lain/mouth_3.png");
  const mouth4 = useTexture("/sprites/lain/mouth_4.png");
  const takIntro = useTexture("/sprites/lain/lain_speak_intro.png");
  const takOutro = useTexture("/sprites/lain/lain_speak_outro.png");

  const mouthRef = useRef<THREE.SpriteMaterial>(null);
  const audioAnalyser = useStore((state) => state.audioAnalyser);

  useFrame(() => {
    if (audioAnalyser) {
      const buffer = new Uint8Array(audioAnalyser.analyser.fftSize / 2);
      audioAnalyser.analyser.getByteTimeDomainData(buffer);

      let rms = 0;
      for (let i = 0; i < buffer.length; i++) {
        rms += buffer[i] * buffer[i];
      }

      rms = Math.sqrt(rms / buffer.length);

      if (mouthRef.current) {
        if (rms >= 130) {
          mouthRef.current.map = mouth4;
        } else if (rms >= 129 && rms <= 130) {
          mouthRef.current.map = mouth3;
        } else if (rms > 128 && rms <= 129) {
          mouthRef.current.map = mouth2;
        } else {
          mouthRef.current.map = mouth1;
        }
      }
    }
  });

  return (
    <>
      <sprite scale={[11, 7.7, 0]} visible={props.intro || props.outro}>
        {props.intro && (
          <LainConstructor
            texture={takIntro}
            frameCount={31}
            framesHorizontal={6}
            framesVertical={6}
          />
        )}
        {props.outro && (
          <LainConstructor
            texture={takOutro}
            frameCount={39}
            framesHorizontal={7}
            framesVertical={6}
          />
        )}
      </sprite>
      <sprite
        scale={[11, 7.7, 0]}
        renderOrder={2}
        visible={!props.intro && !props.outro}
      >
        <spriteMaterial
          map={mouth4}
          alphaTest={0.01}
          ref={mouthRef}
          depthTest={false}
        />
      </sprite>
    </>
  );
};

export default LainSpeak;
