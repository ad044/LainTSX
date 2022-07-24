import React, { createRef, useMemo, memo } from "react";
import { useFrame } from "@react-three/fiber";
import AudioVisualizerColumn from "./AudioVisualizerColumn";
import { useStore } from "@/store";

const AudioVisualizer = () => {
  const audioAnalyser = useStore((state) => state.audioAnalyser);
  const columnRefs: React.RefObject<THREE.Mesh>[][] = useMemo(
    () =>
      Array.from({ length: 15 }, () => [
        createRef<THREE.Mesh>(),
        createRef<THREE.Mesh>(),
        createRef<THREE.Mesh>(),
        createRef<THREE.Mesh>(),
      ]),
    []
  );

  useFrame(() => {
    if (audioAnalyser) {
      const frequencyData = audioAnalyser.getFrequencyData();

      columnRefs.forEach((refArray, idx) => {
        const [ref1, ref2, ref3, ref4] = refArray;

        const currentFrequency = frequencyData[16 * idx];

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
    }
  });

  return (
    <group position={[0, 0, -3]}>
      {columnRefs.map((refArray, idx: number) => (
        <AudioVisualizerColumn
          position={[0, -idx / 2, 0]}
          refs={refArray}
          key={idx}
        />
      ))}
    </group>
  );
};

export default memo(AudioVisualizer);
