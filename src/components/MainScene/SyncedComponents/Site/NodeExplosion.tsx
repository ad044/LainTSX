import React, { useMemo, useRef, useState } from "react";
import ExplosionLine from "./NodeExplosion/ExplosionLine";
import node_explosion_line_positions from "../../../../resources/node_explosion_line_positions.json";
import { useFrame } from "react-three-fiber";

const NodeExplosion = () => {
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
    const now = Date.now();
    if (now > lastTime.current + 2400) {
      if (currentFrame < 6) {
        setCurrentFrame(currentFrame + 1);
        lastTime.current = now;
      }
    }
  });

  return (
    <group position={[-0.5, 0.45, 0]}>
      {Object.values(linePoses).map((entry) => (
        <ExplosionLine
          rotation={entry.rotation as [number, number, number]}
          position={entry.position as [number, number, number]}
          color={entry.color}
          length={entry.length}
        />
      ))}
    </group>
  );
};

export default NodeExplosion;
