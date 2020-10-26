import React from "react";
import TriangularPrism from "./LeftSide/TriangularPrism";
import Cube from "./LeftSide/Cube";

type LeftSideProps = {
  activeMediaComponent: string;
};

export type ShapeProps = {
  position: number[];
  selectable?: boolean;
  active?: boolean;
};

const LeftSide = (props: LeftSideProps) => {
  const cubesActive = props.activeMediaComponent === "exit";
  const trianglesActive = props.activeMediaComponent === "play";

  return (
    <group position={[0, 0, -3]}>
      <Cube position={[-2.7, -1.6, 0.6]} active={cubesActive} />
      <TriangularPrism position={[-3.5, -1.6, 0.6]} active={!trianglesActive} />
      <Cube position={[-3.5, -0.9, 0.6]} active={cubesActive} />
      <TriangularPrism position={[-2.7, -0.9, 0.6]} active={trianglesActive} />
      <Cube position={[-3.5, -0.9, 1.2]} active={cubesActive} />
      <TriangularPrism position={[-3.5, -1.6, 1.2]} active={trianglesActive} />

      {/*main two*/}
      <Cube
        position={[-2.7, -1.6, 1.2]}
        active={cubesActive}
        selectable={true}
      />
      <TriangularPrism
        position={[-2.7, -0.9, 1.2]}
        active={trianglesActive}
        selectable={true}
      />
    </group>
  );
};

export default LeftSide;
