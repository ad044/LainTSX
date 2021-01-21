import React, { useEffect, useMemo, useRef, useState } from "react";
import ExplosionLine from "./NodeExplosion/ExplosionLine";
import node_explosion_line_positions from "../../../../../resources/node_explosion_line_positions.json";

import { useFrame } from "react-three-fiber";
import GoldNode from "./NodeExplosion/GoldNode";
import { useMainSceneStore } from "../../../../../store";

const NodeExplosion = () => {
  const explosionVisible = useMainSceneStore(
    (state) => state.activeNodeState.exploding
  );

  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [shouldRotate, setShouldRotate] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(1);

  const linePoses = useMemo(
    () =>
      node_explosion_line_positions[
        currentFrame.toString() as keyof typeof node_explosion_line_positions
      ],
    [currentFrame]
  );

  const lastTime = useRef(0);

  useFrame(() => {
    if (shouldAnimate) {
      const now = Date.now();
      if (now > lastTime.current + 100) {
        if (currentFrame < 6) {
          setCurrentFrame(currentFrame + 1);
          lastTime.current = now;
        }
      }
    }
  });

  useEffect(() => {
    if (explosionVisible) {
      setShouldRotate(true);
      setTimeout(() => {
        setShouldAnimate(true);
      }, 1100);
    } else {
      setShouldAnimate(false);
      setShouldRotate(false);
      setCurrentFrame(1);
    }
  }, [explosionVisible]);

  return explosionVisible ? (
    <group position={[-0.5, 0.45, 0]}>
      <group
        visible={shouldAnimate}
        position={[-0.1, 0.1, 0]}
        scale={[1.2, 1.2, 1.2]}
      >
        {Object.values(linePoses).map((entry, idx) => (
          <ExplosionLine
            rotation={entry.rotation as [number, number, number]}
            position={entry.position as [number, number, number]}
            color={entry.color}
            length={entry.length}
            key={idx}
          />
        ))}
      </group>
      <GoldNode visible={shouldRotate} goldTexture={shouldAnimate} />
    </group>
  ) : (
    <></>
  );
};

export default NodeExplosion;
