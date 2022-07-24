import { RenderCallback, useFrame } from "@react-three/fiber";
import { useRef } from "react";

const useCappedFrame = (
  callback: RenderCallback,
  framerate: number = 0.016,
  renderPriority?: number
) => {
  const deltaRef = useRef(0);
  useFrame((state, delta) => {
    deltaRef.current += delta;
    if (deltaRef.current > framerate) {
      callback(state, deltaRef.current, renderPriority);
      deltaRef.current = deltaRef.current % framerate;
    }
  });
};

export default useCappedFrame;
