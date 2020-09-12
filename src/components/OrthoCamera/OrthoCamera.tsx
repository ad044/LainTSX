import React, { useMemo, useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Scene } from "three";
import HUDElement from "../HUD/HUDElement";
import Orb from "../Orb";
import { useRecoilValue } from "recoil";
import { orthoCamPosYAtom } from "./OrthoCameraAtom";
import { useSpring, a } from "@react-spring/three";

interface OrthoCameraProps {
  orbVisibility: boolean;
  hudVisibility: boolean;
}

const OrthoCamera = (props: OrthoCameraProps) => {
  const { gl, scene, camera } = useThree();
  const virtualScene = useMemo(() => new Scene(), []);
  const virtualCam = useRef();
  const orthoCameraPosY = useRecoilValue(orthoCamPosYAtom);

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
      <HUDElement key={1} hudVisibility={props.hudVisibility} />
      <Orb orbVisibility={props.orbVisibility} />
    </a.orthographicCamera>
  );
};

export default OrthoCamera;
