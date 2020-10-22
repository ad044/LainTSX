import React, { useState } from "react";
import TriangularPrism from "./TriangularPrism";
import Cube from "./Cube";

type LeftSideProps = {
  activeMediaElement: string;
};

export type ShapeProps = {
  position: number[];
  selectable?: boolean;
  active?: boolean;
};

const LeftSide = (props: LeftSideProps) => {
  const cubesActive = props.activeMediaElement === "exit";
  const trianglesActive = props.activeMediaElement === "play";

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
