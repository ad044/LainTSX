import React, { memo } from "react";

const Lights = memo(() => {
  return (
    <>
      <pointLight color={0xffffff} position={[0, 0, 7]} intensity={1} />
      <pointLight color={0x7f7f7f} position={[0, 10, 0]} intensity={1.5} />
      <pointLight color={0xffffff} position={[8, 0, 0]} intensity={0.2} />
      <pointLight color={0xffffff} position={[-8, 0, 0]} intensity={0.2} />
    </>
  );
});

export default Lights;
