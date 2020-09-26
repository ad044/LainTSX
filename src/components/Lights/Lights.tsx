import React, { memo, useRef } from "react";
import { useRecoilValue } from "recoil";
import { a, useSpring } from "@react-spring/three";
import { lightPosYAtom, lightRotYAtom } from "./LightsAtom";

const Lights = memo(() => {
  const lightRotY = useRecoilValue(lightRotYAtom);
  const lightPosY = useRecoilValue(lightPosYAtom);

  const lightState = useSpring({
    lightRotY: lightRotY,
    lightPosY: lightPosY,
    config: { duration: 1200 },
  });

  return (
    <a.group
      position-y={lightState.lightPosY}
      rotation-y={lightState.lightRotY}
    >

      <pointLight color={0xffffff} position={[0, 0, 6]} intensity={1} />

      <pointLight color={0x7f7f7f} position={[0, 0.5, -0.5]} intensity={2.5} />

      {/*<pointLight color={0xffffff} position={[0, 0, 6.2]} intensity={1} />*/}
      {/*<mesh position={[50.09, -1, 5.2]} scale={[0.1, 0.1, 0.1]}>*/}
      {/*  <sphereBufferGeometry attach="geometry">*/}
      {/*    <meshStandardMaterial color={0xffffff} attach="material" />*/}
      {/*  </sphereBufferGeometry>*/}
      {/*</mesh>*/}

      {/*<pointLight color={0xffffff} position={[0.08, 0, 0]} intensity={0.3} />*/}
      {/*<mesh position={[0.08, 0, 0]} scale={[0.01, 0.01, 0.01]}>*/}
      {/*  <sphereBufferGeometry attach="geometry">*/}
      {/*    <meshStandardMaterial color={0xffffff} attach="material" />*/}
      {/*  </sphereBufferGeometry>*/}
      {/*</mesh>*/}

    </a.group>
  );
});

export default Lights;
