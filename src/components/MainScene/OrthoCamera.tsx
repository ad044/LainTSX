import React, { memo, useMemo, useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Scene } from "three";
import HUD from "./HUD";
import YellowOrb from "./YellowOrb";
import { useBlueOrbStore } from "../../store";
import TextRenderer from "../TextRenderer/TextRenderer";

const OrthoCamera = memo(() => {
  const { gl, scene, camera } = useThree();
  const virtualScene = useMemo(() => new Scene(), []);
  const virtualCam = useRef();

  const hudVisible = useBlueOrbStore((state) => state.hudVisible);

  useFrame(() => {
    gl.autoClear = false;
    gl.clear();
    gl.render(scene, camera);
    gl.clearDepth();
    gl.render(virtualScene, virtualCam.current!);
  }, 1);

  //-0.6
  return (
    <orthographicCamera
      ref={virtualCam}
      position={[0, 0, 10]}
      rotation={[0, 0, 0]}
    >
      <HUD key={1} hudVisibility={hudVisible} />
      <TextRenderer />
      <YellowOrb />
    </orthographicCamera>
  );
});

export default OrthoCamera;
