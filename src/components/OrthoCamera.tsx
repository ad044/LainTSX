import React, {
  useState,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  useFrame,
  Canvas,
  useLoader,
  useThree,
  useCamera,
  createPortal,
} from "react-three-fiber";
//import Orb from "./Orb";
import { OrthographicCamera, Octahedron } from "drei";
import { Matrix4, Scene, BasicDepthPacking } from "three";
import * as THREE from "three";
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
        longHudType={props.longHudType}
        boringHudType={props.boringHudType}
        bigHudType={props.bigHudType}
        longHudPosition={props.longHudPosition}
        longHudScale={props.longHudScale}
        boringHudPosition={props.boringHudPosition}
        boringHudScale={props.boringHudScale}
        bigHudPosition={props.bigHudPosition}
        bigHudScale={props.bigHudScale}
        key={props.id}
      />
    </OrthographicCamera>
  );
};

export default OrthoCamera;
