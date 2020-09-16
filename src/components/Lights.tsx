import React, { memo } from "react";

const Lights = memo(() => {
  return (
    <>
      <ambientLight color={0x808080} intensity={1} />
      <pointLight color={0xffffff} position={[0, 0, 7]} intensity={3} />
      <pointLight color={0x7f7f7f} position={[0, 10, 0]} intensity={3} />
    </>
  );
});

export default Lights;
