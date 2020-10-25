import React, { createRef, MutableRefObject, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";
import AudioVisualizerColumn from "./AudioVisualizerColumn";

const AudioVisualizer = () => {
  const analyser = useMemo(() => {
    const listener = new THREE.AudioListener();

    const audio = new THREE.Audio(listener);
    audio.setMediaElementSource(
      document.getElementById("media") as HTMLMediaElement
    );

    return new THREE.AudioAnalyser(audio, 2048);
  }, []);

  const columnRefs = useMemo(() => {
    let ref1, ref2, ref3, ref4;
    return Array.from({ length: 15 }, () => [
      (ref1 = createRef<THREE.Object3D>()),
      (ref2 = createRef<THREE.Object3D>()),
      (ref3 = createRef<THREE.Object3D>()),
      (ref4 = createRef<THREE.Object3D>()),
    ]);
  }, []);

  useFrame(() => {
    const frequencyData = analyser.getFrequencyData();

    columnRefs.forEach((refArray, idx) => {
      const ref1 = refArray[0];
      const ref2 = refArray[1];
      const ref3 = refArray[2];
      const ref4 = refArray[3];

      // we up it by 1.2 just so it becomes a bit more noticable, otherwise
      // the visualizer is a bit too "calm"
      const currentFrequency = frequencyData[32 * idx] * 1.2;

      switch (true) {
        case currentFrequency >= 255:
          ref1.current!.visible = true;
          ref2.current!.visible = true;
          ref3.current!.visible = true;
          ref4.current!.visible = true;
          break;
        case currentFrequency >= 192:
          ref1.current!.visible = true;
          ref2.current!.visible = true;
          ref3.current!.visible = true;
          ref4.current!.visible = false;
          break;
        case currentFrequency >= 128:
          ref1.current!.visible = true;
          ref2.current!.visible = true;
          ref3.current!.visible = false;
          ref4.current!.visible = false;
          break;
        case currentFrequency >= 64:
          ref1.current!.visible = true;
          ref2.current!.visible = false;
          ref3.current!.visible = false;
          ref4.current!.visible = false;
          break;
        default:
          ref1.current!.visible = false;
          ref2.current!.visible = false;
          ref3.current!.visible = false;
          ref4.current!.visible = false;
          break;
      }
    });
  });

  return (
    <>
      {columnRefs.map((refArray, idx: number) => (
        <AudioVisualizerColumn
          position={[0, -idx / 2, 0]}
          refs={{
            ref1: refArray[0] as MutableRefObject<THREE.Object3D>,
            ref2: refArray[1] as MutableRefObject<THREE.Object3D>,
            ref3: refArray[2] as MutableRefObject<THREE.Object3D>,
            ref4: refArray[3] as MutableRefObject<THREE.Object3D>,
          }}
          key={idx}
        />
      ))}
    </>
  );
};

export default AudioVisualizer;
