import React, { memo } from "react";

type LightProps = {
  ambientLightVal: number;
};

const Lights = memo((props: LightProps) => {
  return (
    <>
      <ambientLight color={0x808080} intensity={props.ambientLightVal} />
      <pointLight color={0xffffff} position={[0, 0, 700]} intensity={0.5} />
      <pointLight color={0x7f7f7f} position={[0, 1000, 0]} intensity={1} />
      <pointLight color={0xffffff} position={[0, 0, 0]} intensity={0.1} />
    </>
  );
});

export default Lights;
