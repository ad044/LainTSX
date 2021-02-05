import React, { useEffect, useRef, useState } from "react";
import TriangleNode from "./NodeRip/TriangleNode";
import { useStore } from "../../../../store";
import RipLine from "./NodeRip/RipLine";
import { useFrame } from "react-three-fiber";

const NodeRip = () => {
  const nodeShrinking = useStore(
    (state) => state.activeNodeState.shrinking
  );
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const LCG = (a: number, c: number, m: number, s: number) => () =>
    (s = (s * a + c) % m);

  const lcgInstance = LCG(1664525, 1013904223, 2 ** 32, 2);

  const firstLineSet = Array.from({ length: 25 }, (_, idx) => {
    let coordSet = [lcgInstance() / 7000000000, lcgInstance() / 7000000000];
    if (coordSet[0] > 0.45) coordSet[0] = coordSet[0] * -1;
    if (coordSet[1] > 0.45) coordSet[1] = coordSet[1] * -1;

    const color = idx % 2 === 0 ? "red" : "yellow";

    return { coordinates: coordSet, color: color };
  });

  const sndLineSet = Array.from({ length: 25 }, (_, idx) => {
    let coordSet = [lcgInstance() / 6000000000, lcgInstance() / 6000000000];
    if (coordSet[0] > 0.65) coordSet[0] = coordSet[0] * -1;
    if (coordSet[1] > 0.65) coordSet[1] = coordSet[1] * -1;

    const color = idx % 2 === 0 ? "yellow" : "red";

    return { coordinates: coordSet, color: color };
  });

  const [currentFrame, setCurrentFrame] = useState(0);

  const lastTime = useRef(0);

  useFrame(() => {
    if (shouldAnimate) {
      const now = Date.now();
      if (currentFrame < 3) {
        if (now > lastTime.current + 200) {
          setCurrentFrame(currentFrame + 1);
          lastTime.current = now;
        }
      }
    }
  });

  useEffect(() => {
    if (nodeShrinking) {
      setTimeout(() => {
        setShouldAnimate(true);
      }, 1150);
    } else {
      setShouldAnimate(false);
      setCurrentFrame(1);
    }
  }, [nodeShrinking]);

  return (
    <group visible={shouldAnimate}>
      <TriangleNode
        rotation={[1.3, 1.6, 0]}
        pivotRotation={[0, -Math.PI / 4 - 0.5, 0]}
        shouldAnimate={shouldAnimate}
      />
      <TriangleNode
        rotation={[0.4, 0.3, 0]}
        pivotRotation={[0, -Math.PI / 8, 0]}
        shouldAnimate={shouldAnimate}
      />
      <TriangleNode
        rotation={[1.6, 2.6, 0]}
        pivotRotation={[0, Math.PI / 4 + 0.5, 0]}
        shouldAnimate={shouldAnimate}
      />
      <TriangleNode
        rotation={[-0.7, 1.8, 0]}
        pivotRotation={[0, Math.PI / 8, 0]}
        shouldAnimate={shouldAnimate}
      />
      <group position={[-0.05, -0.3, 0.1]}>
        <group visible={currentFrame === 1}>
          {firstLineSet.map((data, idx) => (
            <RipLine
              color={data.color}
              endPoints={data.coordinates}
              key={idx}
            />
          ))}
        </group>

        <group visible={currentFrame === 2}>
          {sndLineSet.map((data, idx) => (
            <RipLine
              color={data.color}
              endPoints={data.coordinates}
              key={idx}
            />
          ))}
        </group>
      </group>
    </group>
  );
};

export default NodeRip;
