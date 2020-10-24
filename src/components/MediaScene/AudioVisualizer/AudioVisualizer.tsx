import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import AudioVisualizerColumn from "./AudioVisualizerColumn";
import { useAudioVisualizerStore } from "../../../store";

const AudioVisualizer = () => {
  const setFrequency = useAudioVisualizerStore((state) => state.setFrequency);
  const analyser = useMemo(() => {
    const listener = new THREE.AudioListener();

    const audio = new THREE.Audio(listener);
    audio.setMediaElementSource(
      document.getElementById("media") as HTMLMediaElement
    );

    return new THREE.AudioAnalyser(audio, 2048);
  }, []);

  useFrame(() => {
    if (!(document.getElementById("media") as HTMLMediaElement).paused)
      setFrequency(analyser.getFrequencyData());
  });

  return (
    <>
      <AudioVisualizerColumn position={[0, 0, 0]} idx={0} />
      <AudioVisualizerColumn position={[0, -0.5, 0]} idx={1} />
      <AudioVisualizerColumn position={[0, -1, 0]} idx={2} />
      <AudioVisualizerColumn position={[0, -1.5, 0]} idx={3} />
      <AudioVisualizerColumn position={[0, -2, 0]} idx={4} />
      <AudioVisualizerColumn position={[0, -2.5, 0]} idx={5} />
      <AudioVisualizerColumn position={[0, -3, 0]} idx={6} />
      <AudioVisualizerColumn position={[0, -3.5, 0]} idx={7} />
      <AudioVisualizerColumn position={[0, -4, 0]} idx={8} />
      <AudioVisualizerColumn position={[0, -4.5, 0]} idx={9} />
      <AudioVisualizerColumn position={[0, -5, 0]} idx={10} />
      <AudioVisualizerColumn position={[0, -5.5, 0]} idx={11} />
      <AudioVisualizerColumn position={[0, -6, 0]} idx={12} />
      <AudioVisualizerColumn position={[0, -6.5, 0]} idx={13} />
      <AudioVisualizerColumn position={[0, -7, 0]} idx={14} />
    </>
  );
};

export default AudioVisualizer;
