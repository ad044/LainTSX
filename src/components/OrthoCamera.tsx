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
import HUDElement from "./HUDElement";
import level_sprite_huds from "../resources/level_sprite_huds.json";

type PositionAndScaleProps = [number, number, number];

const OrthoCamera = () => {
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
      {Object.values(level_sprite_huds.level04).map((spriteHud) => {
        return (
          <HUDElement
            longHudType={spriteHud.long.type}
            boringHudType={spriteHud.boring.type}
            bigHudType={spriteHud.big.type}
            longHudPosition={spriteHud.long.position as PositionAndScaleProps}
            longHudScale={spriteHud.long.scale as PositionAndScaleProps}
            boringHudPosition={
              spriteHud.boring.position as PositionAndScaleProps
            }
            boringHudScale={spriteHud.boring.scale as PositionAndScaleProps}
            bigHudPosition={spriteHud.big.position as PositionAndScaleProps}
            bigHudScale={spriteHud.big.scale as PositionAndScaleProps}
          />
        );
      })}
    </OrthographicCamera>
  );
};

export default OrthoCamera;
