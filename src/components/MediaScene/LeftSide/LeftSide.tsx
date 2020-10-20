import React from "react";
import TriangularPrism from "./TriangularPrism";
import Cube from "./Cube";

type LeftSideShapesProps = {
  active: "cube" | "triangle" | "";
};

export type ShapeProps = {
  position: number[];
  selectable?: boolean;
  active?: boolean;
};

const LeftSide = (props: LeftSideShapesProps) => {
  const cubesActive = props.active === "cube";
  const trianglesActive = props.active === "triangle";

  return (
    <>
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
    </>
  );
};

export default LeftSide;
