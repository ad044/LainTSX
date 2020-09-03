import React, { memo } from "react";

const Lights = memo(() => {
  return (
    <>
      <ambientLight color={0x808080} />
      <pointLight color={0xffffff} position={[0, 0, 700]} intensity={0.5} />
      <pointLight color={0x7f7f7f} position={[0, 1000, 0]} intensity={1} />
      <pointLight color={0xffffff} position={[0, 0, 0]} intensity={0.1} />
    </>
  );
});

export default Lights;
