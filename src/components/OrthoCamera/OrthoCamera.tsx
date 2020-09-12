import React, { memo, useMemo, useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Scene } from "three";
import HUDElement from "../HUD/HUDElement";
import Orb from "../Orb/Orb";
import { useRecoilValue } from "recoil";
import { orthoCamPosYAtom } from "./OrthoCameraAtom";
import { useSpring, a } from "@react-spring/three";
import { orbVisibilityAtom } from "../Orb/OrbAtom";
import { hudVisibilityAtom } from "../HUD/HUDActiveAtom";

const OrthoCamera = memo(() => {
  const { gl, scene, camera } = useThree();
  const virtualScene = useMemo(() => new Scene(), []);
  const virtualCam = useRef();
  const orthoCameraPosY = useRecoilValue(orthoCamPosYAtom);

  const orbVisible = useRecoilValue(orbVisibilityAtom);

  const hudVisible = useRecoilValue(hudVisibilityAtom);

  const orthoCameraState = useSpring({
    orthoCameraPosY: orthoCameraPosY,
    config: { duration: 1200 },
  });

  useFrame(() => {
    gl.autoClear = false;
    gl.clear();
    gl.render(scene, camera);
    gl.clearDepth();
    gl.render(virtualScene, virtualCam.current!);
  }, 1);

  //-0.6
  return (
    <a.orthographicCamera
      ref={virtualCam}
      position={[0, 0, 10]}
      position-y={orthoCameraState.orthoCameraPosY}
    >
      <HUDElement key={1} hudVisibility={hudVisible} />
      <Orb orbVisibility={orbVisible} />
    </a.orthographicCamera>
  );
});

export default OrthoCamera;
