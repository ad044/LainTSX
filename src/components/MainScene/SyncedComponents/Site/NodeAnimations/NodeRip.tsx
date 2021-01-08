import React from "react";
import TriangleNode from "./NodeRip/TriangleNode";

const NodeRip = () => {
  return (
    <>
      <TriangleNode
        rotation={[1.3, 1.6, 0]}
        pivotRotation={[0, -Math.PI / 4 - 0.5, 0]}
      />
      <TriangleNode
        rotation={[0.4, 0.3, 0]}
        pivotRotation={[0, -Math.PI / 8, 0]}
      />
      <TriangleNode
        rotation={[1.6, 2.6, 0]}
        pivotRotation={[0, Math.PI / 4 + 0.5, 0]}
      />
      <TriangleNode
        rotation={[-0.7, 1.8, 0]}
        pivotRotation={[0, Math.PI / 8, 0]}
      />
    </>
  );
};

export default NodeRip;
