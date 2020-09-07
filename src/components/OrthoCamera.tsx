import React, { useMemo, useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Scene } from "three";
import HUDElement, { HUDElementProps } from "./HUDElement";
import Orb from "./Orb";

interface OrthoCameraProps extends HUDElementProps {
  id: string;
  orthoCameraPosY: number;
  orbVisibility:boolean;
}

const OrthoCamera = (props: OrthoCameraProps) => {
  const { gl, scene, camera } = useThree();
  const virtualScene = useMemo(() => new Scene(), []);
  const virtualCam = useRef();

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
      position={[0, props.orthoCameraPosY, 10]}
    >
      <HUDElement
        longHUDType={props.longHUDType}
        boringHUDType={props.boringHUDType}
        bigHUDType={props.bigHUDType}
        longHUDPosYZ={props.longHUDPosYZ}
        longHUDPosX={props.longHUDPosX}
        longHUDScale={props.longHUDScale}
        boringHUDPosYZ={props.boringHUDPosYZ}
        boringHUDPosX={props.boringHUDPosX}
        boringHUDScale={props.boringHUDScale}
        bigHUDPosYZ={props.bigHUDPosYZ}
        bigHUDPosX={props.bigHUDPosX}
        bigHUDScale={props.bigHUDScale}
        key={props.id}
      />
      <Orb orbVisibility={props.orbVisibility}/>
    </orthographicCamera>
  );
};

export default OrthoCamera;
