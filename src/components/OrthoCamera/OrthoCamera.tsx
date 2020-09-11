import React, {useMemo, useRef} from "react";
import {useFrame, useThree} from "react-three-fiber";
import {Scene} from "three";
import HUDElement from "../HUD/HUDElement";
import Orb from "../Orb";
import {useRecoilValue} from "recoil";
import {orthoCamPosYAtom} from "./OrthoCameraAtom";

interface OrthoCameraProps {
  orbVisibility: boolean;
  hudVisibility: boolean;
}

const OrthoCamera = (props: OrthoCameraProps) => {
  const { gl, scene, camera } = useThree();
  const virtualScene = useMemo(() => new Scene(), []);
  const virtualCam = useRef();
  const orthoCameraPosY = useRecoilValue(orthoCamPosYAtom);

  useFrame(() => {
    gl.autoClear = false;
    gl.clear();
    gl.render(scene, camera);
    gl.clearDepth();
    gl.render(virtualScene, virtualCam.current!);
  }, 1);

  //-0.6
  return (
    <orthographicCamera ref={virtualCam} position={[0, orthoCameraPosY, 10]}>
      <HUDElement key={1} hudVisibility={props.hudVisibility} />
      <Orb orbVisibility={props.orbVisibility} />
    </orthographicCamera>
  );
};

export default OrthoCamera;
