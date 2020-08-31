//import Orb from "./Orb";
import { OrthographicCamera } from "drei";
import React, { useMemo, useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Scene } from "three";
import HUDElement, { HUDElementProps } from "./HUDElement";

interface OrthoCameraProps extends HUDElementProps {
  id: string;
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

  return (
    <OrthographicCamera
      ref={virtualCam}
      makeDefault={false}
      position={[0, 0, 10]}
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
    </OrthographicCamera>
  );
};

export default OrthoCamera;
