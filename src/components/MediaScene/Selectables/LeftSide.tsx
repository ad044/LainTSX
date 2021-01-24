import React, { useCallback, useMemo, memo } from "react";
import TriangularPrism from "./LeftSide/TriangularPrism";
import Cube from "./LeftSide/Cube";
import { useSpring, a } from "@react-spring/three";
import { useStore } from "../../../store";

export type ShapeProps = {
  position: number[];
  selectable?: boolean;
  active?: boolean;
};

const LeftSide = memo(() => {
  const activeMediaComponent = useStore(
    useCallback(
      (state) =>
        state.mediaComponentMatrix[state.mediaComponentMatrixIndices.sideIdx][
          state.mediaComponentMatrixIndices.sideIdx === 0
            ? state.mediaComponentMatrixIndices.leftSideIdx
            : state.mediaComponentMatrixIndices.rightSideIdx
        ],
      []
    )
  );

  const cubesActive = useMemo(() => activeMediaComponent === "exit", [
    activeMediaComponent,
  ]);
  const trianglesActive = useMemo(() => activeMediaComponent === "play", [
    activeMediaComponent,
  ]);

  const groupSpringConfig = useMemo(() => ({ duration: 500 }), []);
  const groupSpringFinalDest = useMemo(
    () => ({ posX: 0, posZ: 0, posY: 0 }),
    []
  );

  const topFrontGroupPos = useSpring({
    config: groupSpringConfig,
    to: groupSpringFinalDest,
    from: { posX: 4, posZ: 2, posY: 1 },
  });

  const bottomFrontGroupPos = useSpring({
    config: groupSpringConfig,
    to: groupSpringFinalDest,
    from: { posX: 0, posZ: 2, posY: 0 },
  });

  const topBehindGroupPos = useSpring({
    config: groupSpringConfig,
    to: groupSpringFinalDest,
    from: { posX: 0, posZ: -3, posY: 2 },
  });

  const bottomBehindGroupPos = useSpring({
    config: groupSpringConfig,
    to: groupSpringFinalDest,
    from: { posX: 4, posZ: -2, posY: 1 },
  });

  return (
    <group position={[0, 0, -3]}>
      <a.group
        position-x={bottomBehindGroupPos.posX}
        position-z={bottomBehindGroupPos.posZ}
        position-y={bottomBehindGroupPos.posY}
      >
        <Cube position={[-2.7, -1.6, 0.6]} active={cubesActive} />
        <TriangularPrism
          position={[-3.5, -1.6, 0.6]}
          active={!trianglesActive}
        />
      </a.group>
      <a.group
        position-x={topBehindGroupPos.posX}
        position-z={topBehindGroupPos.posZ}
        position-y={topBehindGroupPos.posY}
      >
        <Cube position={[-3.5, -0.9, 0.6]} active={cubesActive} />
        <TriangularPrism
          position={[-2.7, -0.9, 0.6]}
          active={trianglesActive}
        />
      </a.group>
      <a.group
        position-x={topFrontGroupPos.posX}
        position-z={topFrontGroupPos.posZ}
        position-y={topFrontGroupPos.posY}
      >
        <Cube position={[-3.5, -0.9, 1.2]} active={cubesActive} />
        <TriangularPrism
          position={[-2.7, -0.9, 1.2]}
          active={trianglesActive}
          selectable={true}
        />
      </a.group>
      <a.group
        position-x={bottomFrontGroupPos.posX}
        position-z={bottomFrontGroupPos.posZ}
        position-y={bottomFrontGroupPos.posY}
      >
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
});

export default LeftSide;
