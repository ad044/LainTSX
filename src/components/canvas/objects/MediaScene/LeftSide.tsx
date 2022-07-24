import React, { memo, useMemo } from "react";
import TriangularPrism from "./TriangularPrism";
import Cube from "./Cube";
import { a, useSpring } from "@react-spring/three";
import { useStore } from "@/store";
import { MediaComponent, Position } from "@/types";

type LeftSideSpring = {
  topFront: Position;
  bottomFront: Position;
  topBack: Position;
  bottomBack: Position;
};

const LeftSide = () => {
  const activeComponent = useStore((state) => state.mediaComponent);

  const cubesActive = useMemo(
    () => activeComponent === MediaComponent.Exit,
    [activeComponent]
  );

  const trianglesActive = useMemo(
    () => activeComponent === MediaComponent.Play,
    [activeComponent]
  );

  const positionSpring = useSpring<{
    from: LeftSideSpring;
    to: LeftSideSpring;
  }>({
    from: {
      topFront: [4, 2, 1],
      bottomFront: [0, 2, 0],
      topBack: [0, -3, 2],
      bottomBack: [4, -2, 1],
    },
    to: {
      topFront: [0, 0, 0],
      bottomFront: [0, 0, 0],
      topBack: [0, 0, 0],
      bottomBack: [0, 0, 0],
    },
    config: { duration: 500 },
  });

  return (
    <group position={[0, 0, -3]}>
      <a.group position={positionSpring.bottomBack}>
        <Cube position={[-2.7, -1.6, 0.6]} active={cubesActive} />
        <TriangularPrism
          position={[-3.5, -1.6, 0.6]}
          active={trianglesActive}
        />
      </a.group>
      <a.group position={positionSpring.topBack}>
        <Cube position={[-3.5, -0.9, 0.6]} active={cubesActive} />
        <TriangularPrism
          position={[-2.7, -0.9, 0.6]}
          active={trianglesActive}
        />
      </a.group>
      <a.group position={positionSpring.topFront}>
        <Cube position={[-3.5, -0.9, 1.2]} active={cubesActive} />
        <TriangularPrism
          position={[-2.7, -0.9, 1.2]}
          active={trianglesActive}
          selectable={true}
        />
      </a.group>
      <a.group position={positionSpring.bottomFront}>
        <Cube
          position={[-2.7, -1.6, 1.2]}
          active={cubesActive}
          selectable={true}
        />
        <TriangularPrism
          position={[-3.5, -1.6, 1.2]}
          active={trianglesActive}
        />
      </a.group>
    </group>
  );
};

export default memo(LeftSide);
