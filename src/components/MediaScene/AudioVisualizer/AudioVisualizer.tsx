import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";

const AudioVisualizer = () => {
  const analysedData = useMemo(() => {
    const listener = new THREE.AudioListener();

    const audio = new THREE.Audio(listener);
    audio.setMediaElementSource(
      document.getElementById("media") as HTMLMediaElement
    );

    const analyser = new THREE.AudioAnalyser(audio, 32);

    return analyser.getFrequencyData()[0];
  }, []);

  const t = useRef<any>();
  useFrame(() => {});
  return (
    <>
      <mesh scale={[analysedData, 0.5, 0.5]} position={[0, 0, 0]} ref={t}>
        <meshBasicMaterial attach="material" />
        <planeBufferGeometry attach="geometry" />
      </mesh>
    </>
  );
};

export default AudioVisualizer;
